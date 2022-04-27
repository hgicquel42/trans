import { Modal } from "comps/modal/modal";
import { Anchor } from "comps/next/anchor";
import { useTheme } from "comps/theme/context";
import { useElement } from "libs/react/handles/element";
import React, { useCallback } from 'react';
import { FaRegLightbulb } from 'react-icons/fa';
import { usePopper } from 'react-popper';

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

	friends: any
	requestFriend: any
	history: any
}

export function LayoutMenuBar() {
	const theme = useTheme()

	const reference = useElement<HTMLButtonElement>()
	const dropdown = useElement<HTMLDivElement>()

	const popper = usePopper(
		reference.value, dropdown.value,
		{ strategy: "fixed", placement: "bottom-start" })

	const switchTheme = useCallback(() => {
		if (theme.stored === "dark")
			theme.set("light")
		else if (theme.stored === "light")
			theme.set(undefined)
		else if (theme.stored === undefined)
			theme.set("dark")
	}, [theme.stored])

	const profile = useProfile()

	return <div className="w-full max-w-[1200px] m-auto p-4">
		<div className="flex justify-between">
			<button className="p-2 flex items-center"
				onClick={switchTheme}>
				<FaRegLightbulb className="w-10 h-10 text-opposite" />
				<div className="text-sm font-pixel uppercase">
					{theme.stored ?? "auto"}
				</div>
			</button>
			<div className="flex">
				<div className="text-xl font-pixel pt-6">
					{profile?.username}
				</div>
				{profile && <button className="px-2 py-2 w-24"
					onClick={reference.use}>
					<img src={profile?.photo} className="w-12 h-12 rounded-full" alt="" />
				</button>}
				{reference.value && <Modal>
					<div className="fixed inset-0"
						onClick={reference.unset} />
					<div className="z-10 font-pixel py-2 text-center rounded shadow-lg bg-default border-2 border-opposite min-w-[12rem] bg-contrast"
						style={popper.styles.popper}
						{...popper.attributes.popper}
						ref={dropdown.set}>
						<Anchor className="text-sm py-2 px-4 block bg-transparent hover:underline"
							href="/profil">
							Profil
						</Anchor>
						<div className="h-0 my-2 border border-solid border-t-0 border-opposite" />
						<a className="text-sm py-2 px-4 block bg-transparent hover:underline">
							Disconnect
						</a>
					</div>
				</Modal>}
			</div>
		</div>
	</div>
};