import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTESHOMEDX: RouteInfo[] = [
    { path: 'home', title: 'menu.Dashboard', icon: 'fa fa-home', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: true, submenu: [] },
    { path: 'iniciatives', title: 'f29.Initiatives', icon: 'fa fa-th', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: true, submenu: [] },
    { path: 'thefoundation', title: 'f29.The Foundation', icon: 'fa fa-building-o', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: true, submenu: [] },
    { path: 'ecosystem', title: 'f29.Ecosystem', icon: 'fa fa-globe', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: true, submenu: [] },
    { path: '/lab', title: 'Lab 29', icon: 'fa fa-flask', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [] },
    { path: '/news', title: 'f29.News', icon: 'fa fa-newspaper', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [] },
    { path: 'awards', title: 'f29.Awards', icon: 'fa fa-award', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: true, submenu: [] },
    { path: 'contact', title: 'f29.Contact', icon: 'fa fa-envelope', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: true, submenu: [] },
    { path: '/donate', title: 'f29.Donate', icon: 'fa fa-heart', class: '', badge: '', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [] },
];
