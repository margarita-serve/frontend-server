import { useRuntimeConfig } from "#app";
import { join } from "pathe";
import { useFetch, useClipboard, usePermission, useStorage, StorageSerializers } from "@vueuse/core";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { MessageTypes, StateKeys, StoreTypes, APIResponse, defaultMessageType, IUser, defaultUser, IAuth, defaultAuth, ILogin, validators, MLAuth, MLLogin } from "~~/src/models";
import { Router } from "vue-router";
import { useVuelidate } from "@vuelidate/core";

let auth = null;
const messageTimeout = 5000;
let toast = null;
let confirm = null;
let router: Router = null;

const redirect = (path: object) => {
  return router.push(path);
};
const onBeforeFetch = ({ url, options, cancel }) => {
  return options;
};
const onAfterFetch = (ctx) => {
  return ctx;
};
const onFetchError = (ctx) => {
  if (ctx.data && ctx.data.message) {
    ctx.error = new Error(ctx.data.message);
  }
  return ctx;
};
const defaultRequestTimeout = () => {
  return useRuntimeConfig().requestTimeout;
};

/**
 * 원격서버 요청 URL 구성
 * @param group API Group
 * @param path Path
 * @returns URL Path
 */
function getApiUrl(group: string, path: string): string {
  const config = useRuntimeConfig();
  if (config.nodeEnv === "development") {
    return `${config.backendUrl}:${config.backendPort}/api/v1/${join(group, path)}`;
  }
  if (config.nodeEnv === "production"){
    return `/api/v1/${join(group, path)}`;
    // return `${config.backendUrl}:${config.backendPort}/api/v1/${join(group, path)}`;
  }else {
    return `${location.protocol}//${location.hostname}:${config.backendPort}/${join(group, path)}`;
  }
  // console.log(`/api/v1/${join(group, path)}`);
}

function makeResponse(error, data, statusCode, showError): APIResponse {
  if (error.value) {
    if (showError) UI.showToastMessage(MessageTypes.ERROR, "API 호출 오류", `${error.value.message}`);
    return new APIResponse(data.value, error.value.message, true, statusCode.value || 200);
  } else {
    return new APIResponse(data.value, "", false, statusCode.value || 200);
  }
}

// ------------------------------------------------------ MLops Code ------------------------------------------------------
// ------------------------------------------------------ MLops Code ------------------------------------------------------
// ------------------------------------------------------ MLops Code ------------------------------------------------------

const MLopsAPI = {
  get: async (group: string, path: string, showError: boolean = false, timeLimit: number = defaultRequestTimeout()) => {
    const { error, data, statusCode } = await useFetch(getApiUrl(group, path), setMLAPIOptions({ method: "GET" }), { timeout: timeLimit * 1000, beforeFetch: onBeforeFetch, afterFetch: onAfterFetch, onFetchError: onFetchError }).json();
    return makeResponse(error, data, statusCode, showError);
  },
  post: async (group: string, path: string, body: object, showError: boolean = false, timeLimit: number = defaultRequestTimeout()) => {
    const { error, data, statusCode } = await useFetch(getApiUrl(group, path), setMLAPIOptions({ method: "POST", body: JSON.stringify(body) }), { timeout: timeLimit * 1000, beforeFetch: onBeforeFetch, afterFetch: onAfterFetch, onFetchError: onFetchError }).json();
    return makeResponse(error, data, statusCode, showError);
  },
  put: async (group: string, path: string, body: object, showError: boolean = false, timeLimit: number = defaultRequestTimeout()) => {
    const { error, data, statusCode } = await useFetch(getApiUrl(group, path), setMLAPIOptions({ method: "PUT", body: JSON.stringify(body) }), { timeout: timeLimit * 1000, beforeFetch: onBeforeFetch, afterFetch: onAfterFetch, onFetchError: onFetchError }).json();
    return makeResponse(error, data, statusCode, showError);
  },
  notBodyPut: async (group: string, path: string, showError: boolean = false, timeLimit: number = defaultRequestTimeout()) => {
    const { error, data, statusCode } = await useFetch(getApiUrl(group, path), { method: "PUT", headers: { Authorization: `bearer ${auth.value.token}`} }, { timeout: timeLimit * 1000, beforeFetch: onBeforeFetch, afterFetch: onAfterFetch, onFetchError: onFetchError }).json();
    return makeResponse(error, data, statusCode, showError);
  },
  patch: async (group: string, path: string, body: object, showError: boolean = false, timeLimit: number = defaultRequestTimeout()) => {
    const { error, data, statusCode } = await useFetch(getApiUrl(group, path), setMLAPIOptions({ method: "PATCH", body: JSON.stringify(body) }), { timeout: timeLimit * 1000, beforeFetch: onBeforeFetch, afterFetch: onAfterFetch, onFetchError: onFetchError }).json();
    return makeResponse(error, data, statusCode, showError);
  },
  delete: async (group: string, path: string = "", showError: boolean = false, timeLimit: number = defaultRequestTimeout()) => {
    const opts = { method: "DELETE" } as any;
    if (auth.value.isAuthenticated) {
      opts.Authorization = `bearer ${auth.value.token}`;
    }
    const { error, data, statusCode } = await useFetch(getApiUrl(group, path), setMLAPIOptions({ method: "DELETE" }), { timeout: timeLimit * 1000, beforeFetch: onBeforeFetch, afterFetch: onAfterFetch, onFetchError: onFetchError });
    return makeResponse(error, data, statusCode, showError);
  },
  call: async (url: string, opts: any = {}, showError: boolean = false, timeLimit: number = defaultRequestTimeout()) => {
    const { error, data, statusCode } = await useFetch(url, setMLAPIOptions(opts), { timeout: timeLimit * 1000, beforeFetch: onBeforeFetch, afterFetch: onAfterFetch, onFetchError: onFetchError });
    if (showError) {
      UI.showToastMessage(MessageTypes.ERROR, "API 호출 오류", `${error.value.message}`);
    }
    return { error, data, statusCode };
  },
  graph: async (group: string, path: string, showError: boolean = false, timeLimit: number = defaultRequestTimeout()) => {
    const { error, data, statusCode } = await useFetch(getApiUrl(group, path), setMLAPIOptions({ method: "GET" }), { timeout: timeLimit * 1000, beforeFetch: onBeforeFetch, afterFetch: onAfterFetch, onFetchError: onFetchError });
    return makeResponse(error, data, statusCode, showError);
  },
  fileupload: async (group: string, path: string, body: any, showError: boolean = false, timeLimit: number = defaultRequestTimeout()) => {
    const { error, data, statusCode } = await useFetch(getApiUrl(group, path), { method: "POST", body: body, headers: { Authorization: `bearer ${auth.value.token}`,} }, { timeout: timeLimit * 1000, beforeFetch: onBeforeFetch, afterFetch: onAfterFetch, onFetchError: onFetchError });
    return makeResponse(error, data, statusCode, showError);
  },
};

function setMLAPIOptions(opts) {
  if (auth.value.isAuthenticated) {
    opts = Object.assign({}, opts, { headers: { Authorization: `bearer ${auth.value.token}`, "Content-Type": "application/json;" } });
  } else {
    opts = Object.assign({}, opts, { headers: { "Content-Type": "application/json;" } });
  }
  return opts;
}

const MLAuths = {
  init: () => {
    auth = State.storage<MLAuth>(StateKeys.AUTH, Util.clone(defaultAuth), StoreTypes.SESSION);
  },
  get: () => {
    if (!auth || !auth.value) {
      auth = State.storage<MLAuth>(StateKeys.AUTH, Util.clone(defaultAuth), StoreTypes.SESSION);
    }
    return auth;
  },
  set: (newVal: MLAuth) => (auth.value = newVal),
  login: async (loginInfo: MLLogin): Promise<MLAuth> => {
    if (sessionStorage?.getItem(loginInfo?.username)) {
      const loggedInAuth: MLAuth = {
        isAuthenticated: true,
        token: sessionStorage.getItem(loginInfo?.username),
        user: undefined,
      };
      MLAuths.set(loggedInAuth);
    } else {
      const res = await MLopsAPI.post("", "auths/login", loginInfo);
      if (res.isError) {
        UI.showToastMessage(MessageTypes.ERROR, "로그인", `서버가 동작하지 않거나 사용자를 인증할 수 없습니다. [${res.message}]`);
      } else {
        const loggedInAuth: MLAuth = {
          isAuthenticated: true,
          token: res.data.response.result?.token,
          user: res?.data?.user,
        };
        sessionStorage.setItem(loginInfo?.username, loggedInAuth?.token);
        MLAuths.set(loggedInAuth);
      }
    }
    return auth.value;
  },
  logout: async (moveToHome = true): Promise<MLAuth> => {
    if (auth.value.isAuthenticated) {
      const logoutAuth = Util.clone(defaultAuth);
      MLAuths.set(logoutAuth);
      if (moveToHome) Routing.moveTo("/");
    }

    return auth.value;
  },
};
// ------------------------------------------------------ MLops Code ------------------------------------------------------
// ------------------------------------------------------ MLops Code ------------------------------------------------------
// ------------------------------------------------------ MLops Code ------------------------------------------------------

const UI = {
  init: () => {
    toast = useToast();
    confirm = useConfirm();
  },
  tableSettings: {
    filters: ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } }),
    scrollHeight: "calc(100vh - 150px)",
    rows: 10,
    paginatorTemplate: "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
    rowPerPageOptions: [5, 10, 20, 50],
    pageReportTemplate: "({first}~{last}) of {totalRecords}",
    initFilters: (pageFilters) => {
      Object.assign(UI.tableSettings.filters.value, pageFilters);
    },
  },
  isDeskTop: () => window.innerWidth >= 992,
  getBasicChartOption: () =>
    new Object({
      responsive: true,
      hoverMode: "index",
      plugins: {
        title: {
          display: true,
          text: "",
        },
        legend: {
          display: true,
          labels: {
            color: "#495057",
          },
        },
        annotation: {
          annotations: {},
        },
      },
      scales: {
        xAxes: {
          display: true,
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        yAxes: {
          display: true,
          stacked: false,
          suggestedMin: 0,
          suggestedMax: 24,
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
      // annotation: {
      //     annotations: []
      // }
    }),
  setFocus: (elRef) => {
    if (elRef && elRef.value) {
      elRef.value.$el.focus();
    }
  },
  getElement: (elRef) => {
    if (elRef && elRef.value) {
      return elRef.value.$el;
    }
    return undefined;
  },
  addClass: (element: Element, className: string) => {
    if (element.classList) element.classList.add(className);
    else element.className += " " + className;
  },
  removeClass: (element: Element, className: string) => {
    if (element.classList) element.classList.remove(className);
    else element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
  },
  showToastMessage: (messageType: MessageTypes, title: string, message: string, fixed: boolean = false) => {
    if (fixed) {
      toast.add({ severity: messageType as string, summary: title, detail: message, group: "tr" });
      console.log(`messages: ${messageType as string}`);
    } else toast.add({ severity: messageType as string, summary: title, detail: message, group: "tr", life: messageTimeout });
  },
  showConfirm: (messageType: MessageTypes, title: string, message: string, acceptCallback, rejectCallback) => {
    confirm.require({
      message: message,
      header: title,
      icon: `pi ${[MessageTypes.ERROR, MessageTypes.WARN].includes(messageType) ? "pi-exclamation-triangle" : "pi-question-circle"}`,
      acceptClass: [MessageTypes.ERROR, MessageTypes.WARN].includes(messageType) ? "p-button-danger" : "p-button-normal",
      accept: () => {
        acceptCallback();
      },
      reject: () => {
        rejectCallback();
      },
    });
  },
  showMessage: (messageType: MessageTypes, title: string, message: string) => {
    // StateHelper를 직접 쓰면 `require` 관련 오류 발생. (원인 파악 및 해결방법 미 확인)
    const msgs = useState(StateKeys.MESSAGE, () => defaultMessageType);
    msgs.value = { severity: messageType, title: title, content: message, display: true };
  },
  getValidate: (rules = null, state = null) => {
    if (rules && state) return useVuelidate(rules, state, { $lazy: true });
    else return useVuelidate();
  },
  getValidators: () => validators,
};

const Routing = {
  /**
   * Initialize (Router Middleware 처리)
   * - 주소줄 입력 처리시는 적용되지 않음
   * - 인증 여부 검증
   * - 페이지 최 상단으로 이동 처리
   */
  init: () => {
    router = useRouter();
    router.beforeEach((to, from, next) => {
      window.scrollTo(0, 0);
      next();
    });
  },
  breadcrumbs: () => {
    const currRoute = router.currentRoute.value;
    let paths = currRoute.path.split("/");
    paths.shift();

    const crumbs = [];

    if (currRoute.fullPath !== "/") {
      let path = "";
      let pathName = "";
      paths.forEach((p, idx) => {
        path = `${path}/${p}`;
        pathName = pathName ? `${pathName}-${p}` : p;

        if (router.hasRoute(pathName)) {
          const title = router.getRoutes().find((r) => r.path === path)?.meta.title || p;
          if (path === currRoute.fullPath) {
            crumbs.push({
              label: title,
            });
          } else {
            crumbs.push({
              to: path,
              label: title,
            });
          }
        } else {
          crumbs.push({
            // COMPLETE: 새로고침 시 %20이 붙어서 나오는 문제
            label: decodeURI(p),
          });
        }
      });
    }
    return crumbs.filter((c) => c.to !== "/");
  },
  // checkAuth: () => {
  //     if (!State.auth.get().value.isAuthenticated) {
  //         UI.showToastMessage(MessageTypes.WARN, "미인증 사용자", "로그인 작업을 진행하십시오.")
  //         router.replace("/login")
  //     }
  // },
  redirect: (path: string) => {
    if (path) redirect({ path: path });
  },
  moveTo: (path: string) => {
    if (path) router.push({path: path});
  },
};

const State = {
  /**
   * User
   */
  getUser: () => useState<IUser>(StateKeys.USER, () => defaultUser),
  /**
   * Authentication
   */
  // auth: {
  //     // TODO: 화면에서 직접 Async로 처리하면서 Directive 사용하는 경우 pending걸리는 문제 검증 필요.
  //     init: async () => {
  //         const auth = State.auth.get()
  //         if (!auth.value.schema) {
  //             // 사용자 인증 형식 조회
  //             await API.get("api/auth", "login")
  //                 .then(res => {
  //                     if (!res.isError) {
  //                         const auth = res.data as IAuthType
  //                         auth.isAuthenticated = false
  //                         State.auth.set(auth as IAuthType)
  //                     }
  //                 })
  //         }
  //     },
  //     check: (): boolean => {
  //         const auth = State.auth.get()
  //         return auth.value.isAuthenticated
  //     },
  //     get: () => {
  //         const val = State.storage(StateKeys.AUTHTYPE, StoreTypes.SESSION)
  //         authSync.value = val || defaultAuthType
  //         return authSync
  //     },
  //     set: (newVal: IAuthType) => {
  //         authSync.value = newVal
  //     }
  // },
  /**
   * Web Storage (local or session)
   */
  storage: <T>(key: StateKeys, initValue: T, storeType: StoreTypes = StoreTypes.LOCAL) => {
    if (storeType === StoreTypes.LOCAL) return useStorage<T>(key, initValue, localStorage, { serializer: StorageSerializers.object });
    else return useStorage<T>(key, initValue, sessionStorage, { serializer: StorageSerializers.object });
  },
  state: <T>(key: StateKeys, init?: () => T) => useState<T>(key, init),
};

const Util = {
  clone: (val): any => {
    return JSON.parse(JSON.stringify(val));
  },
  getEnumMap: (target, stringValues = true) => {
    if (!stringValues) {
      return Object.keys(target)
        .map((key: string) => {
          if (isNaN(Number(key))) {
            return { name: key, value: target[key as any] };
          } else {
            return null;
          }
        })
        .filter((m) => m !== null);
    } else {
      return Object.keys(target).map((key: string) => {
        return { name: key, value: target[key as any] };
      });
    }
  },
  copyToClipboard: (val) => {
    const title = "CLIPBOARD";
    if (!val) {
      UI.showToastMessage(MessageTypes.WARN, title, "Clipboard로 복사할 값을 확인하십시오.");
      return false;
    }
    if (!usePermission("clipboard-write")) {
      UI.showToastMessage(MessageTypes.WARN, title, "Clipboard 쓰기 권한이 없습니다.");
      return false;
    }

    const { copy, isSupported } = useClipboard();
    if (!isSupported) {
      UI.showToastMessage(MessageTypes.WARN, title, "현재 사용중인 브라우저에서는 Clipboard 쓰기를 처리할 수 잆습니다.");
      return false;
    }

    copy(val);
    UI.showToastMessage(MessageTypes.WARN, title, "클립보드로 복사되었습니다.");
    return true;
  },
  formatNumber: (value: number, dec: number) => {
    try {
      return Number(dec ? Number.parseFloat(value.toFixed(dec)) : value).toLocaleString();
    } catch {
      return "NaN";
    }
  },
  getElapsedTime: (timestamp) => {
    const elapsedTime = Date.now() - Date.parse(timestamp);
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const hours = Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    let str = "";

    if (days > 0) {
      str += `${days}d`;
      if (days >= 10) return str;
    }
    if (hours > 0) {
      str += `${hours}h`;
      if (days < 10 && days > 0) return str;
    }
    if (minutes > 0) {
      if (days > 0 || hours > 0) return str;
      str += `${minutes}m`;
    }
    if (seconds > 0) {
      if (hours > 0 || minutes > 9) return str;
      str += `${seconds}s`;
    }

    return str;
  },
  getTimestampString: (timestamp) => {
    const seconds = Math.floor((Date.now() - Date.parse(timestamp)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes";

    return Math.floor(seconds) + " seconds";
  },
};

export default function useAppHelper(opts: any = {}) {
  const options = opts;

  const initialize = () => {
    MLAuths.init();
    Routing.init();
    UI.init();
  };

  return { UI, Routing, State, Util, initialize, MLopsAPI, MLAuths };
}
