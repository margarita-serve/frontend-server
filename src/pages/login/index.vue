<template>
  <div>
    <div class="flex align-self-center align-items-center justify-content-center w-12" style="height: 100vh;">
      <div class="card text-2xl" style="">
        <div class="flex flex-column align-items-center justify-content-center">
          <h3>Kore Serve</h3>
          <div class="flex flex-column m-3">
            <span class="p-input-icon-left">
              <i class="pi pi-user" />
              <K3InputText id="username" type="username" v-model="v$.username.$model" placeholder="UserName" />
            </span>
            <small class="error-field basic label pointing error" v-if="v$.username.$invalid">{{ usenameerrorMessages }}</small>
          </div>
          <div class="flex flex-column align-items-center justify-content-center m-3">
            <span class="p-input-icon-left"> <i class="pi pi-lock" />
              <K3InputText type="password" v-model="v$.password.$model" placeholder="PassWord" />
            </span>
            <small class="error-field basic label pointing error" v-if="v$.password.$invalid">{{ passworderrorMessages }}</small>
          </div>
          <div class="m-3">
            <K3Button v-if="!auth.isAuthenticated" label="Login" class="p-button-info" @click.prevent="onLogin()" />
            <K3Button v-if="auth.isAuthenticated" label="Logout" class="mr-2" @click.prevent="onLogout()" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import { useVuelidate } from '@vuelidate/core';
import { MLLogin, MLLoginValidation, MessageTypes } from '~~/src/models';
const { MLAuths, UI, Routing } = useAppHelper();
const route = useRoute();
// Page meta
definePageMeta({ layout: 'empty', title: 'login', public: true });

const login = ref(MLLogin);
const v$ = useVuelidate(MLLoginValidation, login);
const auth = MLAuths.get();
const messages = ref([]);

const errorMessages = computed(() => { v$?.value.$touch(); return v$.value.$errors.map((err) => err.$message).join(","); });

const usenameerrorMessages = computed(() => { v$?.value.$touch(); return v$.value.username.$errors.map((err) => err.$message).join(","); });
const passworderrorMessages = computed(() => { v$?.value.$touch(); return v$.value.password.$errors.map((err) => err.$message).join(","); });

const onLogin = async () => {
  v$?.value.$touch()

  if (!v$.value.$invalid) {
    auth.value = await MLAuths.login(login.value);
    if (auth?.value?.isAuthenticated) {
      UI.showToastMessage(MessageTypes.INFO, "로그인", `로그인 처리 되었습니다.`);
      Routing?.moveTo('/deployments');
    }
  } else {
    UI.showToastMessage(MessageTypes.WARN, "로그인", `로그인 서버에 문제가 있습니다.`);
  }
};

const onLogout = () => {
  UI.showConfirm(MessageTypes.INFO, "로그아웃", "로그아웃 하시겠습니까?", () => {
    MLAuths.logout(false).then(logoutAuth => {
      if (logoutAuth.isAuthenticated) {
        UI.showToastMessage(MessageTypes.WARN, "로그아웃", "로그아웃 처리중 문제가 발생하였습니다.")
      } else {
        UI.showToastMessage(MessageTypes.INFO, "로그아웃", "로그아웃 처리되었습니다.")
        auth.value = logoutAuth
        messages.value = []
      }
    })
  }, () => {
    UI.showToastMessage(MessageTypes.INFO, "로그아웃", "로그아웃이 취소되었습니다.")
  })
};

/**
 * 인피노브 연동용
 */
const mountLogin = () => {
  const username = route?.query?.id;
  const password = route?.query?.pw;
  login.value = { username: String(username), password: String(password) };
  if(username && password){
    onLogin();
  };
};

onMounted(()=>{ mountLogin(); });

</script>

<style scoped lang="scss">

</style>