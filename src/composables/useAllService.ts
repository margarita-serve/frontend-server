import { MessageTypes } from "../models";

/**
 * Get API-Module and managing class
 * @requires MLopsAPI MLopsAPI is get data API server
 * @requires UI UI is use it Toast
 * @param options noting
 * @returns Real Implementation Functions
 */
export function useAllService(options: any = {}) {
  const { MLopsAPI, UI } = useAppHelper();
  const group = "";
  // ----------------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------- ModelPackage 관련 -----------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------------------

  /**
   * Look up all Model-Packages
   * @async MLopsAPI.get is async
   * @returns All Model-Packages
   */
  const getModelPackagesTable = () => {
    const path = "model-packages";
    const modelpackagesGetAll = ref([]);
    const isFetchModGetAll = ref(false);
    const isStatusCodeModGetAll = ref();
    const isErrorMsgModGetAll = ref();

    const fetchModGetAll = () => {
      isFetchModGetAll.value = true;
      MLopsAPI.get(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch ModelPackages", res.message);
          } else {
            res.data.response.result.Rows?.forEach((item) => {
              modelpackagesGetAll.value.push(item);
              // abcs?.value?.push(item);
              // ?.문법 => 앞에 변수에 값이 없을 때 undefined를 반환하여 에러를 방지한다.
            });
          }
          isFetchModGetAll.value = false;
          isStatusCodeModGetAll.value = res.statusCode;
          isErrorMsgModGetAll.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch ModelPackages", err);
          isFetchModGetAll.value = false;
        });
    };
    // console.log('---------------------------------------------------------------------------');
    // console.log(modelpackagesGetAll);
    return { modelpackagesGetAll, isStatusCodeModGetAll, isErrorMsgModGetAll, isFetchModGetAll, fetchModGetAll };
  };

  /**
   * Look up specific Model-Packages
   * @async MLopsAPI.get is async
   * @param modelPacakgesID Specific Model-Packages ID
   * @returns Specific Model-Packages values
   */
  const getModelPackagesID = (modelPacakgesID: string) => {
    const modelpackagesGetID = ref([]);
    const path = "model-packages/" + modelPacakgesID;
    const isFetchMPID = ref(false);
    const isStatusCodeMPID = ref();
    const isErrorMsgMPID = ref();

    const fetchMPID = () => {
      isFetchMPID.value = true;
      MLopsAPI.get(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch modelpackages", res.message);
          } else {
            modelpackagesGetID.value = res.data.response.result;
            // abcs?.value?.push(item);
            // ?.문법 => 앞에 변수에 값이 없을 때 undefined를 반환하여 에러를 방지한다.
          }
          isFetchMPID.value = false;
          isStatusCodeMPID.value = res.statusCode;
          isErrorMsgMPID.value = res.message;
        })
        .catch((err) => {
          console.log(err);
          UI.showToastMessage(MessageTypes.ERROR, "Fetch modelpackages", err);
          isFetchMPID.value = false;
        });
    };
    return { modelpackagesGetID, isFetchMPID, isStatusCodeMPID, isErrorMsgMPID, fetchMPID };
  };
  // ----------------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------- ModelPackage 관련 -----------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------- Deployments 관련 ------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------------------

  /**
   * Look up all deployment models
   * @async MLopsAPI.get is async
   * @returns All deployment models
   */
  const getDeploymentsTable = () => {
    const path = "deployments";
    const deploymentsGetAll = ref([]);
    const isFetchDeGetAll = ref(false);
    const isStatusCodeDeGetAll = ref();
    const isErrorMsgDeGetAll = ref();

    const fetchDeGetAll = () => {
      isFetchDeGetAll.value = true;
      MLopsAPI.get(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch deployments", res.message);
          } else {
            res.data.response.result.Rows?.forEach((item) => {
              deploymentsGetAll.value.push(item);
            });
            // if (res.data.response.result?.Rows === null){
            //   UI.showToastMessage(MessageTypes.INFO, "Fetch Deployments", 'This Deployments is Empty');
            // }else{
            //   res.data.response.result.Rows?.forEach((item) => {
            //     deploymentsGetAll.value.push(item);
            //   });
            // }
          }
          isFetchDeGetAll.value = false;
          isStatusCodeDeGetAll.value = res.statusCode;
          isErrorMsgDeGetAll.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch deployments", err);
          isFetchDeGetAll.value = false;
        });
    };
    return { deploymentsGetAll, isFetchDeGetAll, isStatusCodeDeGetAll, isErrorMsgDeGetAll, fetchDeGetAll };
  };

  /**
   * Look up specific deployment models
   * @async MLopsAPI.get is async
   * @param deploymentID Specific deployment models ID
   * @returns Specific deployment model values
   */
  const getDeploymentsID = (deploymentID: string) => {
    const deploymentsGetID = ref([]);
    const path = "deployments/" + deploymentID;
    const isfetchDeIDGet = ref(false);
    const isStatusCodeDeIDGet = ref();
    const isErrorMsgDeIDGet = ref();

    const fetchDeIDGet = () => {
      isfetchDeIDGet.value = true;
      MLopsAPI.get(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Deployments", res.message);
          } else {
            deploymentsGetID.value = res.data.response.result;
            // abcs?.value?.push(item);
            // ?.문법 => 앞에 변수에 값이 없을 때 undefined를 반환하여 에러를 방지한다.
          }
          isfetchDeIDGet.value = false;
          isStatusCodeDeIDGet.value = res.statusCode;
          isErrorMsgDeIDGet.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Deployments", err);
          isfetchDeIDGet.value = false;
        });
    };
    return { deploymentsGetID, isfetchDeIDGet, isStatusCodeDeIDGet, isErrorMsgDeIDGet, fetchDeIDGet };
  };

  /**
   * Look up specific deployment models log
   * @async MLopsAPI.get is async
   * @param deploymentID Deployment models ID
   * @returns Specific deployment model log
   */
  const getDeploymentsIDGovernance = (deploymentID: string) => {
    const path = "deployments/" + deploymentID + "/governance-log";
    const goversGet = ref();
    const isFetchGetGover = ref(false);
    const isStatusCodeGetGover = ref();
    const isErrorMsgGetGover = ref();

    const fetchGetGover = () => {
      isFetchGetGover.value = true;
      MLopsAPI.get(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch DeployGovernance", res.message);
          } else {
            goversGet.value = res.data.response.result.EventHistory;
            // abcs?.value?.push(item);
            // ?.문법 => 앞에 변수에 값이 없을 때 undefined를 반환하여 에러를 방지한다.
          }
          isFetchGetGover.value = false;
          isStatusCodeGetGover.value = res.statusCode;
          isErrorMsgGetGover.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch DeployGovernance", err);
          isFetchGetGover.value = false;
        });
    };
    return { goversGet, isFetchGetGover, isStatusCodeGetGover, isErrorMsgGetGover, fetchGetGover };
  };

  /**
   * Look up specific deployment models history
   * @async MLopsAPI.get is async
   * @param deploymentID Deployment models ID
   * @returns Specific deployment model create log
   */
  const getDeploymentsIDHistory = (deploymentID: string) => {
    const path = "deployments/" + deploymentID + "/model-history";
    const historys = ref();
    const isFetchHistory = ref(false);
    const isStatusCodeHistory = ref();
    const isErrorMsgHistory = ref();

    const fetchGetHistory = () => {
      isFetchHistory.value = true;
      MLopsAPI.get(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Model-history", res.message);
          } else {
            historys.value = res.data.response.result.ModelHistory;
            // abcs?.value?.push(item);
            // ?.문법 => 앞에 변수에 값이 없을 때 undefined를 반환하여 에러를 방지한다.
          }
          isFetchHistory.value = false;
          isStatusCodeHistory.value = res.statusCode;
          isErrorMsgHistory.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Model-history", err);
          isFetchHistory.value = false;
        });
    };
    return { historys, isFetchHistory, isStatusCodeHistory, isErrorMsgHistory, fetchGetHistory };
  };

  /**
   * Look up delete deployment models
   * @async MLopsAPI.get is async
   * @param deploymentID Deployment models ID
   * @returns For function operation
   */
  const delDeploymentsID = (deploymentID: string) => {
    const path = "deployments/" + deploymentID;
    const isFetchDeIDDel = ref(false);
    const isStatusCodeDelDeID = ref();
    const isErrorMsgDelDeID = ref();

    const fetchDeleteDeployments = () => {
      isFetchDeIDDel.value = true;
      MLopsAPI.delete(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Delete Deployment", res.message);
          } else {
            UI.showToastMessage(MessageTypes.SUCCESS, "Fetch Delete Deployment", 'Success Delete Deployment');
          }
          isFetchDeIDDel.value = false;
          isStatusCodeDelDeID.value = res.statusCode;
          isErrorMsgDelDeID.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Delete Deployment", err);
          isFetchDeIDDel.value = false;
        });
    };
    return { isFetchDeIDDel, isStatusCodeDelDeID, isErrorMsgDelDeID, fetchDeleteDeployments };
  };

  /**
   * Look up patch deployment models
   * @param deploymentID Deployment models ID
   * @param body Patch deployment body(Json)
   */
  const patchDeploymentsID = (deploymentID: string, body: object) => {
    const path = "deployments/" + deploymentID;
    const isFetchDeIDPatch = ref(false);
    const isStatusCodePatchDeID = ref();
    const isErrorMsgPatchDeID = ref();

    const fetchPatchDeployments = () => {
      isFetchDeIDPatch.value = true;
      MLopsAPI.patch(group, path, body)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Patch Deployment", res.message);
          } else {
            UI.showToastMessage(MessageTypes.SUCCESS, "Fetch Patch Deployment", 'Success Save Deployment Setting');
          }
          isFetchDeIDPatch.value = false;
          isStatusCodePatchDeID.value = res.statusCode;
          isErrorMsgPatchDeID.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Patch Deployment", err);
          isFetchDeIDPatch.value = false;
        });
    };
    return { isFetchDeIDPatch, isStatusCodePatchDeID, isErrorMsgPatchDeID, fetchPatchDeployments };
  };

  /**
   * Change deployment modelpackage
   * @param deploymentID Deployment models ID
   * @param body Patch change deployment body(Json)
   * @returns statusCode, errorMSG, useAPI
   */
  const patchDeploymentsIDReplaceModel = (deploymentID: string, body: object) => {
    const path = "deployments/" + deploymentID + "/replace-model";
    const isFetchPatchDeIDReplace = ref(false);
    const isStatusCodePatchDeIDReplace = ref();
    const isErrorMsgPatchDeIDReplace = ref();

    const fetchPatchDeploymentsReplace = () => {
      isFetchPatchDeIDReplace.value = true;
      MLopsAPI.patch(group, path, body)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Patch Deployment Replace", res.message);
          } else {
            UI.showToastMessage(MessageTypes.SUCCESS, "Fetch Patch Deployment Replace", "Success Replace Model");
          }
          isFetchPatchDeIDReplace.value = false;
          isStatusCodePatchDeIDReplace.value = res.statusCode;
          isErrorMsgPatchDeIDReplace.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Patch Deployment Replace", err);
          isFetchPatchDeIDReplace.value = false;
        });
    };
    return { isFetchPatchDeIDReplace, isStatusCodePatchDeIDReplace, isErrorMsgPatchDeIDReplace, fetchPatchDeploymentsReplace };
  }

  /**
   * Deployment models active
   * @param deploymentID Deployment models ID
   */
  const putDeploymentsIDActive = (deploymentID: string) => {
    const path = "deployments/" + deploymentID + "/active";
    const isFetchPutDeIDActive = ref(false);
    const isStatusCodePutDeIDActive = ref();
    const isErrorMsgPutDeIDActive = ref();
    const putDeIDActive = ref();

    const fetchPutDeploymentsIDActive = () => {
      isFetchPutDeIDActive.value = true;
      MLopsAPI.notBodyPut(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Put Deployment Active", res.message);
          } else {
            UI.showToastMessage(MessageTypes.SUCCESS, "Fetch Put Deployment Active", res.data.response.result?.Message);
          }
          isFetchPutDeIDActive.value = false;
          isStatusCodePutDeIDActive.value = res.statusCode;
          isErrorMsgPutDeIDActive.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Put Deployment Active", err);
          isFetchPutDeIDActive.value = false;
        });
    };
    return { isFetchPutDeIDActive, isStatusCodePutDeIDActive, isErrorMsgPutDeIDActive, fetchPutDeploymentsIDActive };
  }

  /**
   * Deployment models active
   * @param deploymentID Deployment models ID
   */
  const putDeploymentsIDInActive = (deploymentID: string) => {
    const path = "deployments/" + deploymentID + "/inactive";
    const isFetchPutDeIDInActive = ref(false);
    const isStatusCodePutDeIDInActive = ref();
    const isErrorMsgPutDeIDInActive  = ref();
    const putDeIDInActive = ref();

    const fetchPutDeploymentsIDInActive = () => {
      isFetchPutDeIDInActive.value = true;
      MLopsAPI.notBodyPut(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Put Deployment InActive", res.message);
          } else {
            UI.showToastMessage(MessageTypes.SUCCESS, "Fetch Put Deployment InActive", res.data.response.result?.Message);
          }
          isFetchPutDeIDInActive.value = false;
          isStatusCodePutDeIDInActive.value = res.statusCode;
          isErrorMsgPutDeIDInActive.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Put Deployment InActive", err);
          isFetchPutDeIDInActive.value = false;
        });
    };
    return { isFetchPutDeIDInActive, isStatusCodePutDeIDInActive, isErrorMsgPutDeIDInActive, fetchPutDeploymentsIDInActive };
  }

  // ----------------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------- Deployments 관련 ------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------- Graph 관련 ---------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------------------

  const graphCollet = {
    /**
     * For graph display use blob, createObjectURL
     * @param deploymentID Deployment models ID
     * @param modelHistoryID Deployment models history ID
     * @param startDate Graph lookup start date
     * @param endDate Graph lookup end date
     * @returns Html rendering value use it blob, createObjectURL and return
     */
    getGraphDetail: async (deploymentID: string, modelHistoryID: string, startDate: string, endDate: string) => {
      let detail;
      const path = "deployments/" + deploymentID + "/monitor/graph/detail?modelHistoryID=" + modelHistoryID + "&startTime=" + startDate + "&endTime=" + endDate;

      await MLopsAPI.graph(group, path).then((res) => {
        if (res.isError) {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Detail Graph", res.message);
        } else {
          detail = res.data;
        }
      });
      const blob = new Blob([detail], { type: "text/html", endings: "native" });
      const urlObject = URL.createObjectURL(blob);
      return urlObject;
    },

    /**
     * For graph display use blob, createObjectURL
     * @param deploymentID Deployment models ID
     * @param modelHistoryID Deployment models history ID
     * @param startDate Graph lookup start date
     * @param endDate Graph lookup end date
     * @returns Html rendering value use it blob, createObjectURL and return
     */
    getGraphDrift: async (deploymentID: string, modelHistoryID: string, startDate: string, endDate: string) => {
      let drift;
      const path = "deployments/" + deploymentID + "/monitor/graph/drift?modelHistoryID=" + modelHistoryID + "&startTime=" + startDate + "&endTime=" + endDate;
      await MLopsAPI.graph(group, path).then((res) => {
        if (res.isError) {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Drift Graph", res.message);
        } else {
          drift = res.data;
        }
      });
      const blob = new Blob([drift], { type: "text/html", endings: "native" });
      const urlObject = URL.createObjectURL(blob);
      return urlObject;
    },

    /**
     * For graph display use blob, createObjectURL
     * @param deploymentID Deployment models ID
     * @param modelHistoryID Deployment models history ID
     * @param startDate Graph look up type ex) timeline or aggregation
     * @param startDate Graph look up start date
     * @param endDate Graph look up end date
     * @returns Html rendering value use it blob, createObjectURL and return
     */
    getGraphAccOver: async (deploymentID: string, modelHistoryID: string, targetMetric: string, startDate: string, endDate: string) => {
      let accOver;
      const path = "deployments/" + deploymentID + "/monitor/graph/accuracy?modelHistoryID=" + modelHistoryID + "&targetMetric=" + targetMetric + "&startTime=" + startDate + "&endTime=" + endDate;
      await MLopsAPI.graph(group, path).then((res) => {
        if (res.isError) {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch AccuracyOver Graph", res.message);
        } else {
          accOver = res.data;
        }
      });
      const blob = new Blob([accOver], { type: "text/html", endings: "native" });
      const urlObject = URL.createObjectURL(blob);
      return urlObject;
    },

    /**
     * For graph display use blob, createObjectURL
     * @param deploymentID Deployment models ID
     * @param modelHistoryID Deployment models history ID
     * @param startDate Graph lookup start date
     * @param endDate Graph lookup end date
     * @returns Html rendering value use it blob, createObjectURL and return
     */
    getGraphPredictAct: async (deploymentID: string, modelHistoryID: string, startDate: string, endDate: string) => {
      let predictAct;
      const path = "deployments/" + deploymentID + "/monitor/graph/predicted-actual?modelHistoryID=" + modelHistoryID + "&startTime=" + startDate + "&endTime=" + endDate;

      await MLopsAPI.graph(group, path).then((res) => {
        if (res.isError) {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Predict Actual Graph", res.message);
        } else {
          predictAct = res.data;
        }
      });
      const blob = new Blob([predictAct], { type: "text/html", endings: "native" });
      const urlObject = URL.createObjectURL(blob);
      return urlObject;
    },

    /**
     * For graph display use blob, createObjectURL
     * @param deploymentID Deployment models ID
     * @param modelHistoryID Deployment models history ID
     * @param startDate Graph lookup start date
     * @param endDate Graph lookup end date
     * @returns Html rendering value use it blob, createObjectURL and return
     */
    getGraphPredictOverTime: async (deploymentID: string, modelHistoryID: string, startDate: string, endDate: string) => {
      let predictOverTime;
      const path = "deployments/" + deploymentID + "/monitor/graph/prediction-over-time?modelHistoryID=" + modelHistoryID + "&startTime=" + startDate + "&endTime=" + endDate;

      await MLopsAPI.graph(group, path).then((res) => {
        if (res.isError) {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Predict Over Graph", res.message);
        } else {
          predictOverTime = res.data;
        }
      });
      const blob = new Blob([predictOverTime], { type: "text/html", endings: "native" });
      const urlObject = URL.createObjectURL(blob);
      return urlObject;
    },

    /**
     * For graph display use blob, createObjectURL
     * @param deploymentID Deployment models ID
     * @param modelHistoryID Deployment models history ID
     * @param startDate Graph lookup start date
     * @param endDate Graph lookup end date
     * @returns Html rendering value use it blob, createObjectURL and return
     */
    getGraphService: async (deploymentID: string, modelHistoryID: string, startDate: string, endDate: string) => {
      let service;
      const path = "deployments/" + deploymentID + "/monitor/graph/service?modelHistoryID=" + modelHistoryID + "&startTime=" + startDate + "&endTime=" + endDate;

      await MLopsAPI.graph(group, path).then((res) => {
        if (res.isError) {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Service Graph", res.message);
        } else {
          service = res.data;
        }
      });
      const blob = new Blob([service], { type: "text/html", endings: "native" });
      const urlObject = URL.createObjectURL(blob);
      return urlObject;
    },

    /**
     * For graph display use blob, createObjectURL
     * @param deploymentID Deployment models ID
     * @param requestCPU Deployment cpu in use
     * @returns Html rendering value use it blob, createObjectURL and return
     */
    getGraphCPU: async (deploymentID: string, requestCPU: number) => {
      let cpu;
      const path = "deployments/" + deploymentID + "/monitor/graph/cpu?requestCPU=" + requestCPU;

      await MLopsAPI.graph(group, path).then((res) => {
        if (res.isError) {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Cpu Resource", res.message);
        } else {
          cpu = res.data;
        }
      });

      const blob = new Blob([cpu], { type: "text/html", endings: "native" });
      const urlObject = URL.createObjectURL(blob);
      return urlObject;
    },

    /**
     * For graph display use blob, createObjectURL
     * @param deploymentID Deployment models ID
     * @param requestMemory Deployment memory in use
     * @returns Html rendering value use it blob, createObjectURL and return
     */
    getGraphMemory: async (deploymentID: string, requestMemory: number) => {
      let mem;
      const path = "deployments/" + deploymentID + "/monitor/graph/memory?requestMemory=" + requestMemory;

      await MLopsAPI.graph(group, path).then((res) => {
        if (res.isError) {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Memory Resource", res.message);
        } else {
          mem = res.data;
        }
      });

      const blob = new Blob([mem], { type: "text/html", endings: "native" });
      const urlObject = URL.createObjectURL(blob);
      return urlObject;
    },
  };

  /**
   * yyyy-mm-ddThh:mm:ss is convert yyyy-mm-dd:hh
   * @param dateValue yyyy-mm-ddThh:mm:ss date type
   * @returns convert yyyy-mm-dd:hh date type
   */
  const dateFilter = (dateValue: string) => {
    let date, convertDate, returnDate

    date = Date.parse(dateValue);
    convertDate = new Date(date);

    returnDate = convertDate.getFullYear() + '-';
    returnDate += subDateFilter(convertDate.getMonth() + 1) + '-';
    returnDate += subDateFilter(convertDate.getDate()) + ":";
    returnDate += subDateFilter(convertDate.getHours());

    return returnDate
    // if( convertDate.getMonth() + 1 < '10' )
  };

  const subDateFilter = (dateValue: string) => {
    if( dateValue < '10' ){
      return "0" + dateValue;
    }else{
      return dateValue;
    }
  };
  // ----------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------- Graph 관련 ---------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------- Monitor 관련 -------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------------------

  /**
   * Look up all monitor data
   * @async MLopsAPI.get is async
   * @param deploymentID Deployment models ID
   * @returns Specific all monitor data
   */
  const getDeploymentsIDMonitor = (deploymentID: string) => {
    const path = "deployments/" + deploymentID + "/monitor";
    const allMonitorsDrift = ref();
    const allMonitorsAcc = ref();
    const isFetchMonitor = ref(false);
    const isStatusCodeMointor = ref();
    const isErrorMsgMonitor = ref();

    const fetchGetMonitor = () => {
      isFetchMonitor.value = true;
      MLopsAPI.get(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Monitor", res.message);
          } else {
            allMonitorsDrift.value = res.data.response.result.DataDriftSetting;
            allMonitorsAcc.value = res.data.response.result.AccuracySetting;
          }
          isFetchMonitor.value = false;
          isStatusCodeMointor.value = res.statusCode;
          isErrorMsgMonitor.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Monitor", err);
          isFetchMonitor.value = false;
        });
    };
    return { allMonitorsDrift, allMonitorsAcc, isFetchMonitor, isStatusCodeMointor, isErrorMsgMonitor, fetchGetMonitor };
  };

  /**
   * Look up monitor accurancy data
   * @async MLopsAPI.get is async
   * @param deploymentID Deployment models ID
   * @param modelHistoryID Deployment model history id
   * @param startTime startTime
   * @param endTime endTime
   * @returns Specific monitor accurancy data
   */
  const getDeIDMonitorAccurancy = (deploymentID: string, modelHistoryID:string, startTime: string, endTime:string) =>{
    const path = "deployments/" + deploymentID + "/monitor/accuracy?modelHistoryID=" + modelHistoryID + "&type=aggregation&startTime=" + startTime + "&endTime=" + endTime;
    const monitorAccurancys = ref();
    const isFetchMonitorAcc = ref(false);
    const isStatusCodeMonitorAcc = ref();
    const isErrorMsgMonitorAcc = ref();
    // 여기에만 들어가는 특정 변수 - 무조건 200이 내려오기 때문에 메시지로 판별한다.(라고할뻔)
    // const isResultMsgMonitorAcc = ref();

    const fetchGetMonitorAcc = () => {
      isFetchMonitorAcc.value = true;
      MLopsAPI.get(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Monitor Accurancy", res.message);
          } else {
            monitorAccurancys.value = res.data.response.result?.data
          }
          isFetchMonitorAcc.value = false;
          isStatusCodeMonitorAcc.value = res.statusCode;
          isErrorMsgMonitorAcc.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Monitor Accurancy", err);
          isFetchMonitorAcc.value = false;
        });
    };
    return { monitorAccurancys, isStatusCodeMonitorAcc, isErrorMsgMonitorAcc, fetchGetMonitorAcc };
  };

  /**
   * Patch appropriate deployment monitor
   * @param deploymentID Deployment models ID
   * @param body Patch object
   */
  const patchDeIDMonitor = (deploymentID: string, body: object) => {
    const path = "deployments/" + deploymentID + "/monitor";
    const patchDeID = ref();
    const isFetchPatchDeIDMonitor = ref(false);
    const isStatusCodePatchDeIDMonitor = ref();
    const isErrorMsgPatchDeIDMonitor = ref();

    const fetchPatchDeIDMonitor = () => {
      isFetchPatchDeIDMonitor.value = true;
      MLopsAPI.patch(group, path, body)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch patch monitor", res.message);
          } else {
            patchDeID.value = res.data.response.result?.Message;
            UI.showToastMessage(MessageTypes.SUCCESS, "Fetch patch monitor", patchDeID.value);
          }
          isFetchPatchDeIDMonitor.value = false;
          isStatusCodePatchDeIDMonitor.value = res.statusCode;
          isErrorMsgPatchDeIDMonitor.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch patch monitor", err);
          isFetchPatchDeIDMonitor.value = false;
        });
    };
    return { patchDeID, isFetchPatchDeIDMonitor, isStatusCodePatchDeIDMonitor, isErrorMsgPatchDeIDMonitor, fetchPatchDeIDMonitor };
  }

  /**
   * upload monitor actual file
   * @param file upload file
   * @param deploymentID Deployment models ID
   * @param targetLabel Deployment targetLabel
   * @param associationColumn Deployment associationColumn
   * @returns return MSG, StatusCode, ErrorMSG
   */
  const postDeIDMonitorActual = (deploymentID: string, targetLabel: string, associationColumn: string, file: any) => {
    const path = "deployments/" + deploymentID + "/monitor/actual?targetLabel=" + targetLabel + "&associationColumn=" + associationColumn;

    const postDeIDMonitorActual = ref();
    const isFetchpostDeIDMonitorActual = ref(false);
    const isStatusCodepostDeIDMonitorActual = ref();
    const isErrorMsgpostDeIDMonitorActual = ref();

    const fetchPostDeIDMonitorActual = () => {
      isFetchpostDeIDMonitorActual.value = true;
      MLopsAPI.fileupload(group, path, file)
        .then((res) => {
          const objects = eval("("+res?.data+")");
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch post monitor actual", res.data.resonse.result.error);
          } else {
            postDeIDMonitorActual.value = objects.response.result?.Message;
            if(postDeIDMonitorActual?.value){
              UI.showToastMessage(MessageTypes.SUCCESS, "Fetch post monitor actual", postDeIDMonitorActual?.value);
            }else{
              UI.showToastMessage(MessageTypes.SUCCESS, "Fetch post monitor actual", 'Not Match');
            }
          }
          isFetchpostDeIDMonitorActual.value = false;
          isStatusCodepostDeIDMonitorActual.value = res.statusCode;
          isErrorMsgpostDeIDMonitorActual.value = res.message;
        })
        .catch((err) => {
          console.log(err);
          UI.showToastMessage(MessageTypes.ERROR, "Fetch post monitor actual", err);
          isFetchpostDeIDMonitorActual.value = false;
        });
    };
    return { postDeIDMonitorActual, isFetchpostDeIDMonitorActual, isStatusCodepostDeIDMonitorActual, isErrorMsgpostDeIDMonitorActual, fetchPostDeIDMonitorActual };
  }

  // ----------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------- Monitor 관련 -------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------- web-hook 관련 ------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------------------

  /**
   * Web hooks for a specific deployment model
   * @async MLopsAPI.get is async
   * @param deploymentID Deployment models ID
   * @returns All webhooks for a particular deployment model
   */
  const getDeIDWebHooksAll = (deploymentID: String) => {
    const path = "deployments/" + deploymentID + "/noti/web-hooks";
    const webHooksAll = ref([]);
    const isFetchWebHooksAll = ref(false);
    const isStatusCodeWebHooksAll = ref();
    const isErrorMsgWebHooksAll = ref();

    const fetchGetWebHooksAll = () => {
      isFetchWebHooksAll.value = true;
      MLopsAPI.get(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Web Hooks All", res.message);
          } else {
            res.data.response.result.Rows?.forEach((item) => {
              webHooksAll.value.push(item);
            });
            // if (res.data.response.result.Rows === null || res.data.response.result?.Rows === undefined || String(res.data.response.result?.Rows) === '[]'){
            //   UI.showToastMessage(MessageTypes.INFO, "Fetch Web Hooks All", 'This Deployment WebHooks is Empty');
            // }else{
            //   res.data.response.result.Rows?.forEach((item) => {
            //     webHooksAll.value.push(item);
            //   });
            // }
          }
          isFetchWebHooksAll.value = false;
          isStatusCodeWebHooksAll.value = res.statusCode;
          isErrorMsgWebHooksAll.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Web Hooks All", err);
          isFetchWebHooksAll.value = false;
        });
    };
    return { webHooksAll, isFetchWebHooksAll, isStatusCodeWebHooksAll, isErrorMsgWebHooksAll, fetchGetWebHooksAll };
  };

  /**
   * Add web hooks for a specific deployment model
   * @async MLopsAPI.get is async
   * @param deploymentID Deployment models ID
   * @param body Create value type is Json
   * @returns Create webhook data
   */
  const postDeIDWebHook = (deploymentID: string, body: object) => {
    const path = "deployments/" + deploymentID + "/noti/web-hooks";
    const addWebHookID = ref();
    const isFetchPostWebHook = ref(false);
    const isStatusCodePostWebHook = ref();
    const isErrorMsgPostWebHook = ref();

    const fetchPostWebHooksAll = () => {
      isFetchPostWebHook.value = true;
      MLopsAPI.post(group, path, body)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Create Web Hooks", res.data.response.message);
          } else {
            addWebHookID.value = res.data.response.result.webHookID;
            UI.showToastMessage(MessageTypes.SUCCESS, "Fetch Create Web Hooks", "Success Add WebHook");
          }
          isFetchPostWebHook.value = false;
          isStatusCodePostWebHook.value = res.statusCode;
          isErrorMsgPostWebHook.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Create Web Hooks", err);
          isFetchPostWebHook.value = false;
        });
    };
    return { addWebHookID, isFetchPostWebHook, isStatusCodePostWebHook, isErrorMsgPostWebHook, fetchPostWebHooksAll };
  };

  /**
   * Delete web hooks for a specific deployment model
   * @async MLopsAPI.get is async
   * @param deploymentID Deployment models ID
   * @param webHookID Webhook ID
   * @returns Delete webhook data
   */
  const delDeIDWebhook = (deploymentID: string, webHookID: string) => {
    const path = "deployments/" + deploymentID + "/noti/web-hooks/" + webHookID;
    const isFetchDelWebHook = ref(false);
    const isStatusCodeDelWebHook = ref();
    const isErrorMsgDelWebHook = ref();

    const fetchDeleteWebHook = () => {
      isFetchDelWebHook.value = true;
      MLopsAPI.delete(group, path)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Delete Web-Hook", res.message);
          } else {
            UI.showToastMessage(MessageTypes.SUCCESS, "Fetch Delete Web-Hook", 'Success Delete WebHook');
          }
          isFetchDelWebHook.value = false;
          isStatusCodeDelWebHook.value = res.statusCode;
          isErrorMsgDelWebHook.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Delete Web-Hook", err);
          isFetchDelWebHook.value = false;
        });
    };
    return { isFetchDelWebHook, isStatusCodeDelWebHook, isErrorMsgDelWebHook, fetchDeleteWebHook };
  };

  /**
   * Update web hooks for a specific deployment model
   * @async MLopsAPI.get is async
   * @param deploymentID Deployment models ID
   * @param webHookID Webhook ID
   * @param body Create value type is Json
   * @returns Update webhook data
   */
  const patchDeIDWebHook = (deploymentID: string, webHookID: string, body: object) => {
    const path = "deployments/" + deploymentID + "/noti/web-hooks/" + webHookID;
    const isFetchPatchwebHook = ref(false);
    const isStatusCodePatchWebHook = ref();
    const isErrorMsgPatchWebHook = ref();
    const fetchPatchWebHook = () => {
      isFetchPatchwebHook.value = true;
      MLopsAPI.patch(group, path, body)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Patch Web-Hook", res.message);
          } else {
            UI.showToastMessage(MessageTypes.SUCCESS, "Fetch Patch Web-Hook", 'Success Update WebHook');
          }
          isFetchPatchwebHook.value = false;
          isStatusCodePatchWebHook.value = res.statusCode;
          isErrorMsgPatchWebHook.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Patch Web-Hook", err);
          isFetchPatchwebHook.value = false;
        });
    };
    return { isFetchPatchwebHook, isStatusCodePatchWebHook, isErrorMsgPatchWebHook, fetchPatchWebHook };
  }

  /**
   * Test web hooks for a specific deployment model
   * @async MLopsAPI.get is async
   * @param deploymentID Deployment models ID
   * @param body Test value type is Json
   * @returns Test webhook
   */
  const postDeIDWebHookTest = (deploymentID: string, body: object) => {
    const path = "deployments/" + deploymentID + "/noti/web-hooks/test";
    const addWebHookIDTest = ref();
    const isFetchPostWebHookTest = ref(false);
    const isStatusCodePostWebHookTest = ref();
    const isErrorMsgPostWebHookTest = ref();
    const fetchPostWebHooksAllTest = () => {
      isFetchPostWebHookTest.value = true;
      MLopsAPI.post(group, path, body)
        .then((res) => {
          if (res.isError) {
            UI.showToastMessage(MessageTypes.ERROR, "Fetch Test Web Hooks", res.message);
          } else {
            addWebHookIDTest.value = res.data.response.result.message;
            UI.showToastMessage(MessageTypes.SUCCESS, "Fetch Test Web Hooks", "Success Test WebHook");
          }
          isFetchPostWebHookTest.value = false;
          isStatusCodePostWebHookTest.value = res.statusCode;
          isErrorMsgPostWebHookTest.value = res.message;
        })
        .catch((err) => {
          UI.showToastMessage(MessageTypes.ERROR, "Fetch Test Web Hooks", err);
          isFetchPostWebHookTest.value = false;
        });
    };
    return { addWebHookIDTest, isFetchPostWebHookTest, isStatusCodePostWebHookTest, isErrorMsgPostWebHookTest, fetchPostWebHooksAllTest };
  };

  // ----------------------------------------------------------------------------------------------------------------------------
  // -------------------------------------------------------- web-hook 관련 ------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------------------

  const fetch = () => {};
  const fetchDeGetAll = () => {
    console.log("fetchDeGetAll is Not Match Error");
  };
  const fetchDeIDGet = () => {
    console.log("fetchDeIDGet is Not Match Error");
  };
  const fetchDeIDDel = () => {
    console.log("fetchDeIDDel is Not Match Error");
  };
  const fetchGover = () => {
    console.log("fetchGover is Not Match Error");
  };
  const fetchGetHistory = () => {
    console.log("fetchGetHistory is Not Match Error");
  };

  const fetchMPID = () => {
    console.log("fetchMPID is Not Match Error");
  };
  const fetchModGetAll = () => {
    console.log("fetchModGetAll is Not Match Error");
  };

  const fetchGetMonitor = () => {
    console.log("fetchGetMonitor is Not Match Error");
  };

  const fetchGetWebHooksAll = () => {
    console.log("fetchGetWebHooksAll is Not Match Error");
  };

  return {
    getDeploymentsTable,
    getDeploymentsID,
    getDeploymentsIDGovernance,
    getDeploymentsIDHistory,
    delDeploymentsID,
    patchDeploymentsIDReplaceModel,
    patchDeploymentsID,
    putDeploymentsIDActive,
    putDeploymentsIDInActive,

    getModelPackagesTable,
    getModelPackagesID,

    graphCollet,

    getDeploymentsIDMonitor,
    getDeIDMonitorAccurancy,
    patchDeIDMonitor,
    postDeIDMonitorActual,

    getDeIDWebHooksAll,
    postDeIDWebHook,
    delDeIDWebhook,
    patchDeIDWebHook,
    postDeIDWebHookTest,

    dateFilter,
  };
}
