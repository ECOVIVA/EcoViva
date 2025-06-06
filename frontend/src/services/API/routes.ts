const BASE = {
  auth: '',
  community: 'community/',
  thread: (slug: string) => `community/${slug}/threads/`,
  event: (slug: string) => `community/${slug}/events/`,
  challenge: (slug: string) => `community/${slug}/events/challenge/`,
  campaign: (slug: string) => `community/${slug}/events/campaign/`,
  post: 'forum/post/',
  study: 'study/',
  lessons: 'study/lessons/',
  achievements: 'study/achievements/',
  users: 'users/',
  bubble: 'users/bubble/',
};

const routes = {
  auth: {
    login: '/login/',
    logout: '/logout/',
    refresh: '/refresh/',
    verify: '/verify/',
    request_reset_password: '/request_reset_password/',
    confirm_password: (uidb64: string, token: string) =>
      `/confirm-reset-password/${uidb64}/${token}/`,
    confirm_email: (uidb64: string, token: string) =>
      `/confirm-email/${uidb64}/${token}/`,
  },

  user: {
    create: `/${BASE.users}create/`,
    profile: `/${BASE.users}profile/`,
    update: `/${BASE.users}profile/update/`,
    delete: `/${BASE.users}profile/update/`,
    bubble: {
      profile: `/${BASE.bubble}profile/`,
      check_in: `/${BASE.bubble}check-in/create/`,
    },
  },

  community: {
    list: `/${BASE.community}`,
    create: `/${BASE.community}create/`,
    detail: (slug: string) => `/${BASE.community}${slug}/`,
    update: (slug: string) => `/${BASE.community}${slug}/update/`,
    delete: (slug: string) => `/${BASE.community}${slug}/delete/`,
    register: (slug: string) => `/${BASE.community}${slug}/register/`,
    pendingRequests: (slug: string) => `/${BASE.community}${slug}/requests/`,
    confirmRequests: (slug: string) => `/${BASE.community}${slug}/requests/confirmation/`,

    thread: {
      list: (slug: string) => `/${BASE.thread(slug)}list/`,
      create: (slug: string) => `/${BASE.thread(slug)}create/`,
      detail: (slug: string, threadSlug: string) =>
        `/${BASE.thread(slug)}${threadSlug}/`,
      like: (slug: string, threadSlug: string) =>
        `/${BASE.thread(slug)}${threadSlug}/like/`,
      update: (slug: string, threadSlug: string) =>
        `/${BASE.thread(slug)}${threadSlug}/update/`,
      delete: (slug: string, threadSlug: string) =>
        `/${BASE.thread(slug)}${threadSlug}/delete/`,
    },

    post: {
      create: `/${BASE.post}create/`,
      update: (id: number) => `/${BASE.post}${id}/update/`,
      delete: (id: number) => `/${BASE.post}${id}/delete/`,
    },

    event: {
      challenge: {
        list: (slug: string) => `/${BASE.challenge(slug)}`,
        create: (slug: string) => `/${BASE.challenge(slug)}create/`,
        detail: (slug: string, id: number) =>
          `/${BASE.challenge(slug)}${id}/`,
        delete: (slug: string, id: number) =>
          `/${BASE.challenge(slug)}${id}/delete/`,
        competitorCreate: (slug: string, id: number) =>
          `/${BASE.challenge(slug)}${id}/competitors/create/`,
        recordCreate: (slug: string, id: number) =>
          `/${BASE.challenge(slug)}${id}/competitors/record/create/`,
        competitorDelete: (
          slug: string,
          id: number,
          id_competitor: number
        ) =>
          `/${BASE.challenge(slug)}${id}/competitors/delete/${id_competitor}/`,
      },

      campaign: {
        list: (slug: string) => `/${BASE.campaign(slug)}`,
        create: (slug: string) => `/${BASE.campaign(slug)}create/`,
        detail: (slug: string, id: number) =>
          `/${BASE.campaign(slug)}${id}/`,
        update: (slug: string, id: number) =>
          `/${BASE.campaign(slug)}${id}/update/`,
        delete: (slug: string, id: number) =>
          `/${BASE.campaign(slug)}${id}/delete/`,
        toggleJoin: (slug: string, id: number) =>
          `/${BASE.campaign(slug)}${id}/join/`,
        participants: (slug: string, id: number) =>
          `/${BASE.campaign(slug)}${id}/participants/`,
      },
    },
  },

  study: {
    lessons_completion: {
      list: `/${BASE.lessons}complete/`,
      create: `/${BASE.lessons}complete/create/`,
    },
    achievements: {
      list: `/${BASE.achievements}user/`,
    },
  },
};

export default routes;
