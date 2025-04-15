const routes = {
    auth: {
      login: '/login/',
      logout: '/logout/',
      refresh: '/refresh/',
      verify: '/verify/',
      request_reset_password: '/request_reset_password/',
      confirm_password: (uidb64: string, token: string) => (`/confirm-reset-password/${uidb64}/${token}/`),
      confirm_email: (uidb64: string, token: string) => (`/confirm-email/${uidb64}/${token}/`)
    },
    user: {
      create: '/users/create/',
      profile: '/users/profile/',
      update: '/users/profile/update/',
      delete: '/users/profile/update/',
      bubble: {
        profile: '/users/bubble/profile/',
        check_in: '/users/bubble/check-in/create/',
        },
    },
    forum: {
        thread: {
            list: 'forum/thread/list/',
            create: 'forum/thread/create/',
            detail: (slug: string) => `forum/thread/${slug}/`,
            update: (slug: string) => `forum/thread/${slug}/update`,
            delete: (slug: string) => `forum/thread/${slug}/delete`,
        },
        post: {
            create: '/post/create',
            update: (id_post: number) => `/post/${id_post}/update`,
            delete: (id_post: number) => `/post/${id_post}/delete`, 
        },
    },
    study: {
        lessons_completion:{
            list: '/lessons/complete/',
            create: 'study/lessons/complete/create/'
        },
        achievements: {
            list: 'study/achievements/user/'
        }
    }
    }
  
  export default routes