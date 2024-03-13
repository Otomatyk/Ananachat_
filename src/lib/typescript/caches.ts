import type {
	UserProfile,
	Relation,
	Channel,
	FriendRequest,
} from "../../types/records"
import { pb, toUnsuscribe } from "./pb"
import { afterPbInit } from "./internal"
import { currentProfile as currentProfileStore } from "../../services/user"

let currentProfile: UserProfile
currentProfileStore.subscribe(profile => (currentProfile = profile))

type CacheStorage<T> = { [id: Relation]: Promise<T> } & Object

abstract class Cache<T> {
	private _cache: CacheStorage<T> = {}

	abstract collectionName: string
	protected abstract subscribeCollection: boolean

	protected init() {
		if (!this.subscribeCollection) return

		afterPbInit.addTask(() => {
			pb.collection(this.collectionName).unsubscribe("*")

			pb.collection(this.collectionName)
				.subscribe("*", ev => {
					if (
						ev.action !== "update" ||
						!(ev.record.id in this._cache)
					)
						return

					//@ts-ignore
					this._cache[ev.record.id] = ev.record
				})
				.then(unsubscribeFn => {
					console.debug(
						`Subscribed to "${this.collectionName}", from the cache.`,
					)
					toUnsuscribe.push([
						`"${this.collectionName}" cache update`,
						unsubscribeFn,
					])
				})
		})
	}

	async get(id: Relation): Promise<T> {
		if (!(id in this._cache)) {
			console.debug(`Fetch from "${this.collectionName}" : "${id}"`)

			this._cache[id] = new Promise<T>(async (resolve, reject) => {
				resolve(
					await pb
						.collection(this.collectionName)
						.getOne<T>(id, { requestKey: id }),
				)
			})
		}

		console.debug(`Used "${this.collectionName}" cache.`)

		return this._cache[id]
	}

	remove(id: Relation) {
		if (id in this._cache) {
			delete this._cache[id]
			console.debug(`Removed "${id}" from "${this.collectionName}" cache`)
		} else {
			console.warn(
				`Unsucessfully tried to remove the "${id}" record from "${this.collectionName}" cache`,
			)
			console.trace("Pile d'appel :")
		}
	}
}

class UserProfileCache extends Cache<UserProfile> {
	public collectionName = "users_profiles"
	protected subscribeCollection = true

	constructor() {
		super()
		this.init()
	}

	public async getFriend(friendShip: FriendRequest) {
		return await this.get(
			friendShip.from === currentProfile.id
				? friendShip.to
				: friendShip.from,
		)
	}
}

class GroupCache extends Cache<Channel> {
	public collectionName = "channels"
	protected subscribeCollection = true

	constructor() {
		super()
		this.init()
	}
}

export let groupCache = new GroupCache()
export let userProfileCache = new UserProfileCache()
