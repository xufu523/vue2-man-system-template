<template>
  <AMenu
    theme="dark"
    mode="inline"
    :inlineIndent="19"
    :selectedKeys="selectedKeys"
    :openKeys="openKeys"
    @click="handleNavClick"
    @openChange="handleKeysChange"
  >
    <template v-for="item in menus">
      <GSubMenu
        v-if="item.children && item.children.length"
        :menuInfo="item"
        :key="item[fieldNames.path]"
        :fieldNames="fieldNames"
      />
      <AMenuItem
        v-else
        :class="[item.isOutHref && 'is-out-href']"
        :key="item[fieldNames.path]"
      >
        <a v-if="!item.isOutHref" :to="item[fieldNames.path]">
          <AIcon v-if="item[fieldNames.icon]" :type="item[fieldNames.icon]" />
          <span>{{ item[fieldNames.label] }}</span>
        </a>
        <a v-else :href="item[fieldNames.path]" target="_blank">
          <AIcon v-if="item[fieldNames.icon]" :type="item[fieldNames.icon]" />
          <span>{{ item[fieldNames.label] }}</span>
        </a>
      </AMenuItem>
    </template>
  </AMenu>
</template>

<script>
import GSubMenu from './GSubMenu.vue';

export default {
  name: 'GMenu',
  components: {
    GSubMenu,
  },
  created() {
    if (this.menus.length) {
      this.updateMenuKeys(this.menus, this.$route.path);
    }
  },
  data() {
    return {
      navClick: false,
      selectedKeys: [],
      openKeys: [],
      cacheOpenKeys: [],
    };
  },
  props: {
    menus: {
      type: Array,
      default: () => [{}],
    },
    collapsed: Boolean,
    fieldNames: {
      type: Object,
      default: () => ({ label: 'title', icon: 'icon', path: 'path' }),
    },
  },
  computed: {},
  watch: {
    menus(val) {
      this.updateMenuKeys(val, this.$route.path);
    },
    collapsed(val) {
      if (val) {
        this.cacheOpenKeys = this.openKeys;
        this.openKeys = [];
      } else {
        this.openKeys = this.cacheOpenKeys;
      }
    },
    $route(to) {
      if (this.navClick) {
        this.navClick = false;
      } else {
        this.updateMenuKeys(this.menus, to.path);
      }
    },
  },
  methods: {
    // 从当前pathname中解析出对应的openKeys以及selectedKey
    getRelativedKeysByRoutes(initMenus, pathname) {
      let selectedKeys = [];
      let openKeys = [];
      const path = pathname;
      const traversedKeys = [];
      const traverseMenus = menus => {
        if (!menus) return;

        menus.forEach(menu => {
          // 保证两个路径的进行比较的时候，都是以'/'开头
          const routePath = path.startsWith('/') ? path : `/${path}`;
          const menuPath = menu[this.fieldNames.path];
          const newMenuPath = (menuPath && menuPath.startsWith('/') ? menuPath : `/${menuPath}`) || '';

          traversedKeys.push(newMenuPath);

          // 如果当前路径匹配菜单
          if (routePath.startsWith(newMenuPath)) {
            selectedKeys = [...traversedKeys];
          }

          traverseMenus(menu.children);
          traversedKeys.pop();
        });
      };

      traverseMenus(initMenus);

      if (selectedKeys.length) {
        openKeys = selectedKeys.slice(0, selectedKeys.length - 1);
      }

      return { openKeys, selectedKeys };
    },
    // SubMenu 展开/关闭的回调
    handleKeysChange(openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);

      if (latestOpenKey) {
        this.openKeys = openKeys.filter(key => latestOpenKey.startsWith(key));
      } else {
        this.openKeys = openKeys;
      }
    },
    // 点击 MenuItem 调用此函数
    handleNavClick({ item, key, keyPath }) {
      if ([...item.$el.classList].includes('is-out-href')) return;
      const keys = keyPath.slice(1);

      keys.reverse();
      this.navClick = true;
      this.selectedKeys = keyPath;
      this.$router.push(key);
      this.collapsed ? (this.cacheOpenKeys = keys) : (this.openKeys = keys);
    },
    updateMenuKeys(menus, path) {
      const { openKeys, selectedKeys } = this.getRelativedKeysByRoutes(menus, path);

      this.openKeys = openKeys;
      this.selectedKeys = selectedKeys;
    },
  },
};
</script>
