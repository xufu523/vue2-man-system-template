<template>
  <ALayout class="layout">
    <ALayoutSider
      :trigger="null"
      :width="leftSideWidth"
      collapsible
      v-model="collapsed"
      class="left-sider"
    >
      <div class="logo">
        <img src="../assets/logo.svg" alt="">
        <span class="project-name">项目模板</span>
      </div>
      <div class="menu">
        <ASpin :spinning="spinning">
          <GMenu :menus="menus" :collapsed="collapsed" :fieldNames="$constants.MENU_FIELD_NAMES" />
        </ASpin>
      </div>
    </ALayoutSider>
    <div class="right-sider">
      <ALayout>
        <ALayoutHeader class="header">
          <div class="left-header">
            <AIcon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="handleCollapsed"
            />
            <GBreadcrumb separator="/" :menus="menus" :fieldNames="$constants.MENU_FIELD_NAMES" />
          </div>
          <div class="right-header">
            <ADropdown
              class="user"
              :trigger="['click']"
              v-model="dropVisible"
            >
              <a>
                <img src="../assets/default-user.png">
                <span class="username">{{ userInfo.realName || userInfo.userName }}</span>
                <AIcon
                  class="caret-icon"
                  :class="dropVisible ? 'caret-up-icon' : 'caret-down-icon'"
                  type="caret-down"
                />
              </a>
              <AMenu slot="overlay" @click="handleMenuClick">
                <!-- <AMenuItem key="userInfo">个人信息</AMenuItem>
                <AMenuItem key="modifyPass">修改密码</AMenuItem> -->
                <AMenuItem key="logout">退出登录</AMenuItem>
              </AMenu>
            </ADropdown>
          </div>
        </ALayoutHeader>
        <ALayoutContent class="content">
          <div class="router-view-box">
            <KeepAlive>
              <RouterView v-if="$route.meta.keepAlive" class="router-view" />
            </KeepAlive>
            <RouterView v-if="!$route.meta.keepAlive" class="router-view" />
          </div>
        </ALayoutContent>
      </ALayout>
    </div>
  </ALayout>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import GMenu from '@/components/Base/GMenu.vue';
import GBreadcrumb from '@/components/Base/GBreadcrumb.vue';
import * as login from '@/services/login';

export default {
  created() {
    const { path } = this.$route;
    const firstMenuPath = this.firstMenu[this.$constants.MENU_FIELD_NAMES.path];

    if (!firstMenuPath) {
      this.$router.replace('/noAuth');
    } else {
      path === '/' && this.$router.push(firstMenuPath);
    }
  },
  beforeDestroy() {},
  components: {
    GMenu,
    GBreadcrumb,
  },
  data() {
    return {
      collapsed: false,
      spinning: false,
      dropVisible: false,
      leftSideWidth: 260,
    };
  },
  computed: {
    ...mapState(['userInfo', 'menus']),
    ...mapGetters(['firstMenu']),
  },
  watch: {},
  methods: {
    handleCollapsed() {
      this.collapsed = !this.collapsed;
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    },
    handleMenuClick({ key }) {
      this.dropVisible = false;

      switch (key) {
        case 'userInfo':
          break;
        case 'modifyPass':
          break;
        case 'logout':
          this.handleLogout();
          break;
        default:
      }
    },
    handleLogout() {
      this.$confirm({
        title: '提示',
        content: '是否确定退出登录？',
        onOk: async () => {
          try {
            await login.logout();
            this.$router.push('/login');
          } catch (error) {
            this.$router.push('/login');
          }
        },
      });
    },
  },
};
</script>

<style lang="less">
@topHeight: 60px;
@rightMinWidth: 850px;

.layout {
  height: 100%;
  align-items: flex-start;
  .left-sider {
    height: 100%;
    overflow: auto;
  }
  .logo {
    height: @topHeight;
    padding: 0 10px;
    color: #ffffff;
    background: #002140;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 36px;
      display: inline-block;
      vertical-align: middle;
    }
    .project-name {
      width: calc(100% - 36px);
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
      font-size: 18px;
      max-height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }
  .right-sider {
    flex: auto;
    width: 0;
    height: 100%;
    display: flex;
    overflow: auto;
    .ant-layout {
      width: 0;
      min-width: @rightMinWidth;
      height: 100%;
    }
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: @topHeight;
    line-height: @topHeight;
    background: #ffffff;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.2);
    padding: 0 15px;
    .left-header {
      display: flex;
      align-items: center;
    }
    .trigger {
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;
      margin-right: 15px;
      &:hover {
        color: #1890ff;
      }
    }
    .right-header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      line-height: 1.5;
      margin-left: 50px;
      .user {
        cursor: pointer;
        margin-left: 25px;
        transition: color 0.3s;
        img {
          width: 30px;
          height: 30px;
        }
        .username {
          margin: 0 3px 0 8px;
        }
        .caret-icon {
          transition: transform 0.3s;
        }
        .caret-up-icon {
          transform: rotate(180deg);
        }
        .caret-down-icon {
          transform: rotate(0);
        }
      }
    }
  }
  .content {
    height: 0;
    .router-view-box {
      position: relative;
      height: 100%;
      padding: 15px;
      overflow: auto;
    }
    .router-view {
      padding: 15px;
      min-height: 100%;
      background: #ffffff;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.2);
    }
  }
}
.ant-layout-sider-collapsed {
  .logo {
    .project-name {
      display: none;
    }
  }
}
</style>
