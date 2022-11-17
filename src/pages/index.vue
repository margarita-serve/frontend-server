<!-- <template>
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
            <K3InputText type="text" v-model="v$.password.$model" placeholder="PassWord" />
          </span>
          <small class="error-field basic label pointing error" v-if="v$.password.$invalid">{{ passworderrorMessages }}</small>
        </div>

        <div class="m-3">
          <K3Button label="Login" class="p-button-info" @click.prevent="" />
        </div>
      </div>
    </div>
  </div>

  <K3FormContainer>
    <template #header>User Login</template>
    <template #footer>
      <div class="w-10 text-left">
        Logged In: [{{ auth.isAuthenticated }}], Current User: [{{ auth.user || 'None' }}]
      </div>
      <div class="w-30 text-right">
        <K3Button class="mr-2" v-if="!auth.isAuthenticated" label="Login" @click.prevent="onLogin" />
        <K3Button class="mr-2" v-if="auth.isAuthenticated" label="Logout" @click.prevent="onLogout" />
      </div>
    </template>
    <K3FormRow>
      <K3FormColumn label="username" label-align="right" :size="12">
        <K3FormInputField class="w-full" v-model="v$.username" autofocus />
      </K3FormColumn>
      <K3FormColumn label="Pasword" label-align="right" :size="12">
        <K3FormInputField class="w-full" v-model="v$.password" />
      </K3FormColumn>
    </K3FormRow>
  </K3FormContainer>
  <K3Button class="mr-2" label="Register" @click="loginTest()" />
  {{valueTest}}
</template>

<script setup lang="ts">
// // imports
import { useVuelidate } from '@vuelidate/core';
import { MLLogin, MLLoginValidation, MessageTypes } from '~~/src/models';
const { MLAuths, MLAPI, UI, Routing } = useAppHelper();
const router = useRouter();

// // Page meta
definePageMeta({ layout: 'default', title: 'Login', public: true });

const login = ref(MLLogin);
const v$ = useVuelidate(MLLoginValidation, login);
const auth = MLAuths.get();
const messages = ref([]);
const valueTest = ref();

const errorMessages = computed(() => {
  v$.value.$touch();
  return v$.value.$errors.map((err) => err.$message).join(",");
});

const usenameerrorMessages = computed(() => {
  v$.value.$touch();
  return v$.value.username.$errors.map((err) => err.$message).join(",");
});

const passworderrorMessages = computed(() => {
  v$.value.$touch();
  return v$.value.password.$errors.map((err) => err.$message).join(",");
});

const onLogin = async () => {
  v$.value.$touch()

  if (!v$.value.$invalid) {
    auth.value = await MLAuths.login(login.value);
    if (auth.value.isAuthenticated) {
      UI.showToastMessage(MessageTypes.INFO, "로그인", `로그인 처리 되었습니다.`);
      deploymentsPage();
    }
  } else {
    UI.showToastMessage(MessageTypes.WARN, "로그인", `로그인 서버에 문제가 있습니다.`);
  }
}

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
}

const loginTest = () => {
  const { deploymentsGetAll, isFetchDeGetAll, isStatusCodeDeGetAll, isErrorMsgDeGetAll, fetchDeGetAlltest } = useAllService().gettest();
  fetchDeGetAlltest();
  valueTest.value = deploymentsGetAll.value;
}
const deploymentsPage = () => { router.push({ path: '/deployments' }) };


</script>

<style scoped lang="scss">

</style> -->

<template>
  <div class="page-container">
    <div class="page-wrapper">
      <section class="page-header">
        <K3PageTitle />
      </section>
      <section class="page-content">
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'Home', public: true })

const { MLAuths, UI, Routing } = useAppHelper();
const auth = MLAuths.get();
const router = useRouter();

if(!auth?.value?.isAuthenticated){
  router.push({ path: '/login' });
}else{
  // router.push({ path: '/deployments' })
  Routing.moveTo('/deployments')
}



</script>

<style scoped lang="scss">
</style>