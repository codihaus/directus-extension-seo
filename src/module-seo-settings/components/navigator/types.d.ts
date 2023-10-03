export interface NavigatorItem {
	icon?: number
    name?: string
    to?: string
    childrens?: NavigatorItem | []
}