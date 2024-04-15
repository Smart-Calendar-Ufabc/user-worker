export const FILE_STORAGE = {
	PROJECT_FOLDER: 'ease-calendar',
	USER_FOLDER: (userId: string) =>
		`${FILE_STORAGE.PROJECT_FOLDER}/staging/users/profile/${userId}/`,
}
