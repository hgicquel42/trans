import { api, tryAsJson } from "libs/fetch/fetch";
import { ChildrenProps } from "libs/react/props";
import { createContext, useContext, useEffect, useState } from "react";

export interface MatchData {
	id: number,
	userId: number,
	mode: string,
	opponent: BoardData,
	opponentScore: string,
	result: boolean,
	userScore: string
}

export interface FriendRequest {
	user: FriendData,
	requestId: number
}
export interface FriendData {
	id: number
	username: string
	logName: string

	createdAt: string

	win: number
	loose: number

	status: string

	twoFA: boolean
	twoFaAuthSecret: string

	photo: string

	currentHashedRefreshToken: string

	// friends: any[]
	requestFriend: any
	history: any
}
export interface BoardData {
	id: number
	username: string
	logName: string

	createdAt: string

	win: number
	loose: number

	status: string

	twoFA: boolean
	twoFaAuthSecret: string

	photo: string
}

export interface ProfileData {
	id: number
	username: string
	logName: string

	createdAt: string

	win: number
	loose: number

	status: string

	twoFA: boolean
	twoFaAuthSecret: string

	photo: string

	currentHashedRefreshToken: string

	friends: FriendData[]
	requestFriend: FriendRequest[]
	history: MatchData[]
}

export const ProfileContext =
	createContext<ProfileData | undefined>(undefined)

export function useProfile() {
	return useContext(ProfileContext)!
}

export function ProfileProvider(props: ChildrenProps) {
	const [profile, setProfile] = useState<ProfileData>()

	useEffect(() => {
		fetch(api("/user/me"))
			.then(tryAsJson)
			.then(setProfile)
			.catch(console.error)
	}, [])

	return <ProfileContext.Provider value={profile}>
		{props.children}
	</ProfileContext.Provider>
}
