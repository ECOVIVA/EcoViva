const routes = {
    auth: {
      login: '/login/',
      logout: '/logout/',
      refresh: '/refresh/',
      verify: '/verify/',
      resend_email: '/resend-email/'
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