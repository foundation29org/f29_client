import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [

    { path: '/home', title: 'menu.Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [] },
    { path: '/privacy-policy', title: 'registration.Privacy Policy', icon: 'ft-shield', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
];

//Sidebar menu Routes and data
export const ROUTESCLINICAL: RouteInfo[] = [

    { path: '/pages/support', title: 'support.support', icon: 'ft-mail', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/clinical/about', title: 'about.title', icon: 'ft-book', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/pages/profile', title: 'navbar.My Profile', icon: 'ft-edit', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //{ path: '/privacy-policy', title: 'registration.Privacy Policy', icon: 'ft-shield', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
];

//Sidebar menu Routes and data
export const ROUTESSUPERADMIN: RouteInfo[] = [

    { path: '/superadmin/dashboard-superadmin', title: 'menu.Dashboard Super Admin', icon: 'ft-home', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [] },
    { path: '/superadmin/langs', title: 'menu.Languages', icon: 'ft-flag', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/superadmin/translations', title: 'menu.Translations', icon: 'ft-flag', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    { path: '/superadmin/support', title: 'support.support', icon: 'ft-mail', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
];

export const ROUTESADMINGTP: RouteInfo[] = [
    { path: '/admin/dashboard/admingtp', title: 'menu.Dashboard Super Admin', icon: 'ft-home', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [] },
];

//Sidebar menu Routes and data
export const ROUTESHOMEDX: RouteInfo[] = [
    { path: 'home', title: 'menu.Dashboard', icon: 'icon-home', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [] },
    { path: 'thefoundation', title: 'f29.The Foundation', icon: 'fa fa-building-o', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: true, submenu: [] },
    { path: 'ecosystem', title: 'f29.Ecosystem', icon: 'fa fa-globe', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: true, submenu: [] },
    { path: '/news', title: 'f29.News', icon: 'fa fa-newspaper', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [] },
    { path: 'awards', title: 'f29.Awards', icon: 'fa fa-award', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: true, submenu: [] },
    { path: 'contact', title: 'f29.Contact', icon: 'fa fa-envelope', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: true, submenu: [] },
    { path: '/donate', title: 'f29.Donate', icon: 'fa fa-heart', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [] },
];
