import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(), //登录后token存储
    name: "", //获取用户信息后存储用户的name
    avatar: "" //获取用户信息后存储用户的头像
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },

  // 登录后设置token
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERINFO(state, userInfo) {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
  }
};

const actions = {
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo;
  //   return new Promise((resolve, reject) => {
  //     login({
  //       username: username.trim(),
  //       password: password
  //     })
  //       .then(response => {
  //         const { data } = response;
  //         commit("SET_TOKEN", data.token); // 提交第一次设置token
  //         setToken(data.token); // 存储token到cookies中
  //         resolve();
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // },

  // 第二种写法
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    const response = await login({
      username: username.trim(),
      password: password
    });
    if (response.code === 20000) {
      const { data } = response;
      commit("SET_TOKEN", data.token); // 提交第一次设置token
      setToken(data.token); // 存储token到cookies中
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          const { name, avatar } = data;

          // commit("SET_NAME", name);
          // commit("SET_AVATAR", avatar);
          commit('SET_USERINFO',data)
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // 删除token
          resetRouter();  // 重新设置路由
          commit("RESET_STATE");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
