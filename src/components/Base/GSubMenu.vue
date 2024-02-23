<template>
  <ASubMenu
    :key="menuInfo[fieldNames.path]"
    v-bind="$props"
    v-on="$listeners"
  >
    <span slot="title">
      <AIcon v-if="menuInfo[fieldNames.icon]" :type="menuInfo[fieldNames.icon]" />
      <span>{{ menuInfo[fieldNames.label] }}</span>
    </span>
    <template v-for="item in menuInfo.children">
      <GSubMenu
        v-if="item.children && item.children.length"
        :key="item[fieldNames.path]"
        :menuInfo="item"
        :fieldNames="fieldNames"
      />
      <AMenuItem
        v-else
        :class="[item.isOutHref && 'is-out-href']"
        :key="item[fieldNames.path]"
      >
        <a
          v-if="!item.isOutHref"
          :to="item[fieldNames.path]"
        >
          <AIcon v-if="item[fieldNames.icon]" :type="item[fieldNames.icon]" />
          <span>{{ item[fieldNames.label] }}</span>
        </a>
        <a v-else :href="item[fieldNames.path]" target="_blank">
          <AIcon v-if="item[fieldNames.icon]" :type="item[fieldNames.icon]" />
          <span>{{ item[fieldNames.label] }}</span>
        </a>
      </AMenuItem>
    </template>
  </ASubMenu>
</template>

<script>
import { Menu } from 'ant-design-vue';

export default {
  name: 'GSubMenu',
  // must add isSubMenu: true
  isSubMenu: true,
  props: {
    ...Menu.SubMenu.props,
    // Cannot overlap with properties within Menu.SubMenu.props
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
    fieldNames: {
      type: Object,
      default: () => ({ label: 'title', icon: 'icon', path: 'path' }),
    },
  },
  methods: {},
};
</script>
