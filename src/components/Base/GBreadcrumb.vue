<template>
  <ABreadcrumb v-if="usedBreadcrumbs.length" :separator="separator">
      <!-- <ABreadcrumbItem>
        <a-icon type="home" />
      </ABreadcrumbItem> -->
      <ABreadcrumbItem
        v-for="(breadcrumb, index) in usedBreadcrumbs"
        :key="breadcrumb[fieldNames.path]"
      >
        <span v-if="index === usedBreadcrumbs.length - 1" class="no-href-breadcrumb">
          {{ breadcrumb[fieldNames.label] }}
        </span>
        <span v-else-if="breadcrumb.hasChildren" class="no-href-breadcrumb">
          {{ breadcrumb[fieldNames.label] }}
        </span>
        <RouterLink v-else :to="breadcrumb.path">
          {{ breadcrumb[fieldNames.label] }}
        </RouterLink>
      </ABreadcrumbItem>
  </ABreadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp';

// 把路由转换成生成路由需要的格式
function transRoutes(routes) {
  const newRoutes = [];

  function disposeRoutes(routesArr, parentItem) {
    routesArr.forEach(item => {
      const copyItem = JSON.parse(JSON.stringify(item));

      if (parentItem) {
        const path = copyItem.path || '';
        const transPath = path.startsWith('/') ? path : `/${path}`;

        copyItem.path = `${parentItem.path}${transPath}`.replace(/\/\//g, '/');
      }

      if (!copyItem.children) {
        newRoutes.push(copyItem);
      } else {
        disposeRoutes(copyItem.children, copyItem);
      }
    });
  }

  disposeRoutes(routes);

  return newRoutes;
}

export default {
  name: 'GBreadcrumb',
  data() {
    return {};
  },
  props: {
    separator: {
      type: String,
      default: '',
    },
    menus: {
      type: Array,
      default: () => [{}],
    },
    fieldNames: {
      type: Object,
      default: () => ({ label: 'title', icon: 'icon', path: 'path' }),
    },
  },
  computed: {
    usedBreadcrumbs() {
      const { path } = this.$route;

      // 先在导航中查找
      const { matchMenus, pathInMenus } = this.getMatchMenus(path, this.menus);

      if (pathInMenus) {
        return matchMenus;
      }

      // 然后在路由中查找
      const matchRoutes = this.getMatchRoutes();

      // 然后对匹配的数据去重
      return this.$pub.jsonDup([...matchMenus, ...matchRoutes], this.fieldNames.path);
    },
  },
  methods: {
    getMatchMenus(pathname, allMenus) {
      const matchMenus = [];
      let pathInMenus = false;
      const findMenus = menus => {
        const menu = menus.find(item => pathname.startsWith(item[this.fieldNames.path]));

        if (menu) {
          const { children, ...otherMenu } = menu;

          if (pathname === otherMenu[this.fieldNames.path]) pathInMenus = true;

          matchMenus.push({
            ...otherMenu,
            hasChildren: children && children.length,
          });

          if (children && children.length) findMenus(children);
        }
      };

      findMenus(allMenus);

      return { matchMenus, pathInMenus };
    },
    getMatchRoutes() {
      const routes = JSON.parse(JSON.stringify(this.$router.options.routes || []));
      const newRoutes = transRoutes(routes);
      const pathname = this.$route.path;
      const pathSnippets = pathname.split('/').filter(i => i);
      const arr = [];

      pathSnippets.forEach((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const route = newRoutes.find(({ path }) => pathToRegexp(path).exec(url));

        if (route) {
          arr.push({
            ...route,
            hasChildren: false,
            [this.fieldNames.label]: route.meta ? route.meta.breadcrumbName || '--' : '--',
            [this.fieldNames.path]: route.path,
          });
        }
      });

      return arr;
    },
  },
};
</script>

<style lang="less" scoped>
.no-href-breadcrumb {
  cursor: default;
}
.ant-breadcrumb {
  padding: 12px 0 12px 15px;
  & > span:last-child {
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>
