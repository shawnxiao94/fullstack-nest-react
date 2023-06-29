/*
 Navicat MySQL Data Transfer

 Source Server         : nest-admin
 Source Server Type    : MySQL
 Source Server Version : 50739
 Source Host           : localhost:3306
 Source Schema         : fullstack-nest-react

 Target Server Type    : MySQL
 Target Server Version : 50739
 File Encoding         : 65001

 Date: 29/06/2023 22:08:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for role_menu
-- ----------------------------
DROP TABLE IF EXISTS `role_menu`;
CREATE TABLE `role_menu`  (
  `role_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `menu_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`role_id`, `menu_id`) USING BTREE,
  INDEX `IDX_25f45e543fbda0c91da4af7a2a`(`role_id`) USING BTREE,
  INDEX `IDX_96d26921e6aa2172256a55a6bc`(`menu_id`) USING BTREE,
  CONSTRAINT `FK_25f45e543fbda0c91da4af7a2a9` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_96d26921e6aa2172256a55a6bc7` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_menu
-- ----------------------------
INSERT INTO `role_menu` VALUES ('ba02a20a-078c-42f9-a7c9-65ca66deb53c', '3b062006-7f7b-4516-a22e-97ddf12f6536');
INSERT INTO `role_menu` VALUES ('c61fad2f-56ed-4efd-bb06-890f8bc6d2e2', '10522e38-5e92-405c-bacd-17fb700654ef');
INSERT INTO `role_menu` VALUES ('c61fad2f-56ed-4efd-bb06-890f8bc6d2e2', '3b062006-7f7b-4516-a22e-97ddf12f6536');
INSERT INTO `role_menu` VALUES ('c61fad2f-56ed-4efd-bb06-890f8bc6d2e2', '3ee17b20-3d57-4dee-9076-b8273b8bf4c1');
INSERT INTO `role_menu` VALUES ('c61fad2f-56ed-4efd-bb06-890f8bc6d2e2', 'b31b3e36-4938-44b3-b589-dec116cc0857');
INSERT INTO `role_menu` VALUES ('c61fad2f-56ed-4efd-bb06-890f8bc6d2e2', 'c1209357-2adb-43bd-a98f-7db2fe501b52');

-- ----------------------------
-- Table structure for sys_action_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_action_log`;
CREATE TABLE `sys_action_log`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `os` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '操作系统',
  `browser` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '浏览器',
  `ua` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '浏览器ua',
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'IP地址',
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '定位地址',
  `login_time` timestamp(0) NULL DEFAULT NULL COMMENT '登录时间',
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_e6bbb7c737d9cdb07983cb6015e`(`user_id`) USING BTREE,
  CONSTRAINT `FK_e6bbb7c737d9cdb07983cb6015e` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_action_log
-- ----------------------------

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `order_num` int(11) NOT NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '部门状态，1-有效，0-禁用',
  `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '备注',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门名称',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门编号',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `leaderId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `parent_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '父级部门 id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_97cd9846d58cb24ad2d75eba372`(`leaderId`) USING BTREE,
  CONSTRAINT `FK_97cd9846d58cb24ad2d75eba372` FOREIGN KEY (`leaderId`) REFERENCES `sys_user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` int(11) NOT NULL DEFAULT 1 COMMENT '菜单类型 0: 目录 | 1: 菜单 | 2: 权限按钮',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '路由名称',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '路由地址,唯一标识',
  `component_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '组件地址',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单名称',
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '菜单图标',
  `redirect` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '重定向路径',
  `isLink` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '是否外链，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`',
  `isIframe` tinyint(4) NOT NULL COMMENT '是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`',
  `hidden` tinyint(4) NULL DEFAULT 1 COMMENT '是否隐藏路由',
  `keepalive` tinyint(4) NULL DEFAULT 1 COMMENT '是否缓存组件状态',
  `level` int(11) NULL DEFAULT 0 COMMENT '路由层级',
  `sort` int(11) NULL DEFAULT 0 COMMENT '排序',
  `open_mode` tinyint(4) NULL DEFAULT 1,
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `parent_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'root',
  `perms` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '权限标识',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_97c81ac00e821f746d97c84e34`(`path`) USING BTREE,
  UNIQUE INDEX `IDX_300914d18f3d16b0c3a631e8be`(`name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES ('10522e38-5e92-405c-bacd-17fb700654ef', 1, 'sysManageUserManage', '/sysManage/userManage', 'views/sysManage/userManage', '用户管理', 'AppstoreOutlined', '/systemManagement/userManagement', '', 0, 1, 0, 1, 0, 1, '2023-03-10 23:01:50.504049', '2023-03-23 15:46:17.757000', 'b31b3e36-4938-44b3-b589-dec116cc0857', NULL);
INSERT INTO `sys_menu` VALUES ('3b062006-7f7b-4516-a22e-97ddf12f6536', 1, 'home', '/home', 'views/home', '首页', 'HomeOutlined', NULL, '', 0, 1, 0, 0, 0, 1, '2023-03-23 23:22:59.329622', '2023-03-23 23:31:34.189000', 'root', NULL);
INSERT INTO `sys_menu` VALUES ('3ee17b20-3d57-4dee-9076-b8273b8bf4c1', 1, 'SysManageRoleManage', '/sysManage/roleManage', 'views/SysManage/RoleManage', '角色管理', 'AppstoreOutlined', '/systemManagement/roleManagement', '', 0, 1, 0, 2, 1, 2, '2023-03-10 23:03:58.016226', '2023-03-23 16:01:43.491000', 'b31b3e36-4938-44b3-b589-dec116cc0857', NULL);
INSERT INTO `sys_menu` VALUES ('b31b3e36-4938-44b3-b589-dec116cc0857', 0, 'sysManage', '/sysManage', 'views/sysManage', '系统管理', 'PieChartOutlined', '/systemManagement/userManagement', '', 0, 1, 0, 1, 1, 1, '2023-03-10 22:59:30.101028', '2023-03-23 23:31:53.715000', 'root', NULL);
INSERT INTO `sys_menu` VALUES ('c1209357-2adb-43bd-a98f-7db2fe501b52', 1, 'SysManageMenuManage', '/sysManage/menuManage', 'views/SysManage/MenuManage', '菜单管理', 'AppstoreOutlined', '/systemManagement/menuManagement', '', 0, 1, 0, 3, 2, 2, '2023-03-10 23:04:46.174279', '2023-03-23 16:02:08.778000', 'b31b3e36-4938-44b3-b589-dec116cc0857', NULL);

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名称',
  `remark` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '角色备注',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色编号',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_223de54d6badbe43a5490450c3`(`name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES ('ba02a20a-078c-42f9-a7c9-65ca66deb53c', '运营管理', 'yunying', 'yunying', '2023-03-23 00:12:29.624000', '2023-03-24 17:31:45.051000');
INSERT INTO `sys_role` VALUES ('c61fad2f-56ed-4efd-bb06-890f8bc6d2e2', '超管', '管理员', 'superAdmin', '2023-03-10 16:25:47.193000', '2023-03-23 23:32:55.494000');

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '名称',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
  `nick_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像地址',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `mobile` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `type` tinyint(4) NOT NULL DEFAULT 2 COMMENT '帐号类型：0-超管，1-后台管理员, 2-普通用户',
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '所属状态: 1-有效，0-禁用',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `dept_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '账户名',
  `sex` tinyint(4) NOT NULL DEFAULT 0 COMMENT '性别：0-女 1-男',
  `salt` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '盐',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_38bc8e47cfcaa86adc8669ff72`(`account`) USING BTREE,
  INDEX `FK_96bde34263e2ae3b46f011124ac`(`dept_id`) USING BTREE,
  CONSTRAINT `FK_96bde34263e2ae3b46f011124ac` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES ('11b23aa2-b5a0-4430-a421-60ce5a8efd37', '清扬', '$2a$10$P12VHhtoVUe/JsDHaencTOOO4Rlek8fhaZHB7hzO8NPKnRq43h1Om', '清扬', '', '', '', '清扬', 0, 1, '', NULL, NULL, '2023-03-23 22:59:32.331000', '2023-03-23 23:01:51.676689', 'qingyang', 0, '$2a$10$P12VHhtoVUe/JsDHaencTO');
INSERT INTO `sys_user` VALUES ('16b69364-f92a-4dd8-9607-9f1cea015ada', NULL, '$2a$10$4Atddpl9Qcie9NSEFaytpefK5uZP/LXHkoBTk5GKrNVOFpyv1omR2', 'shawn', '', '', '', '', 0, 1, NULL, NULL, NULL, '2023-03-10 16:04:43.911000', '2023-03-10 16:04:43.911000', 'shawnxiao', 1, '$2a$10$4Atddpl9Qcie9NSEFaytpe');
INSERT INTO `sys_user` VALUES ('851e3bad-ce4c-4506-876a-ebce7d36e97e', NULL, '$2a$10$Coog5fqWc4v2xJiKCJx8muc01PuXhREgroDz0yEt9H83EQS8GEGGu', 'hongye', '', '', '', '', 0, 1, NULL, NULL, NULL, '2023-03-10 16:04:56.995000', '2023-03-10 16:04:56.995000', 'hongyeqingfeng', 1, '$2a$10$Coog5fqWc4v2xJiKCJx8mu');
INSERT INTO `sys_user` VALUES ('b31e76fd-d8a0-4669-bab7-f80d6e173264', 'shawn', '$2a$10$o.1khZadIws2hFpitp9VoubgVZFeq0wxC7MKJCfoYQiZGmqdc5M22', '管理员', '', '', '', '', 0, 1, NULL, NULL, NULL, '2023-03-10 16:05:14.129000', '2023-03-17 23:18:36.000000', 'superAdmin', 1, '$2a$10$o.1khZadIws2hFpitp9Vou');

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role`  (
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`) USING BTREE,
  INDEX `IDX_d0e5815877f7395a198a4cb0a4`(`user_id`) USING BTREE,
  INDEX `IDX_32a6fc2fcb019d8e3a8ace0f55`(`role_id`) USING BTREE,
  CONSTRAINT `FK_32a6fc2fcb019d8e3a8ace0f55f` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_d0e5815877f7395a198a4cb0a46` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES ('11b23aa2-b5a0-4430-a421-60ce5a8efd37', 'ba02a20a-078c-42f9-a7c9-65ca66deb53c');
INSERT INTO `user_role` VALUES ('b31e76fd-d8a0-4669-bab7-f80d6e173264', 'c61fad2f-56ed-4efd-bb06-890f8bc6d2e2');

SET FOREIGN_KEY_CHECKS = 1;
