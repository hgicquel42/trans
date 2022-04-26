import { api, tryAsJson } from "libs/fetch/fetch";
import { ChildrenProps } from "libs/react/props";
import { createContext, useContext, useEffect, useState } from "react";

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

export interface Match {
	id: number,
	result: boolean,
	userScore: string,
	opponentScore: string,
	opponentId: number,
	mode: string,
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
	requestFriend: FriendData[]
	history: Match[]
}

export const ProfileContext =
	createContext<ProfileData | undefined>(undefined)

export function useProfile() {
	return useContext(ProfileContext)!
}

export function ProfilProvider(props: ChildrenProps) {
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