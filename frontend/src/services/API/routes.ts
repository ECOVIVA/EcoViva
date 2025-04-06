const routes = {
    auth: {
      login: '/login/',
      logout: '/logout/',
      refresh: '/refresh/',
      verify: '/verify/',
      confirm_email: (uidb64: string, token: string) => `confirm-email/${uidb64}/${token}/`
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
            list: '/thread/list/',
            create: '/thread/create/',
            detail: (slug: string) => `/thread/${slug}/`,
            update: (slug: string) => `/thread/${slug}/update`,
            delete: (slug: string) => `/thread/${slug}/delete`,
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
            create: '/lessons/complete/create/'
        },
        achievements: {
            list: '/achievements/user/'
        }
    }
    }
  
  export default routes