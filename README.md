# umi-plugin-rematch

[![NPM version](https://img.shields.io/npm/v/umi-plugin.svg?style=flat)](https://npmjs.org/package/umi-plugin) [![NPM downloads](http://img.shields.io/npm/dm/umi-plugin.svg?style=flat)](https://npmjs.org/package/umi-plugin)

Rematch plugin for umi

# Intro

默认集成了 Immer 插件

## Usage

1. yarn add umi-plugin-rematch -D
2. yarn add @rematch/core @rematch/immer

安装完成后即可使用，umi 会自动加载 umi-plugin 开头的插件

3. 在 src 目录下任意层级创建 models 目录
4. models 内下创建 model: xxx.rm.ts

支持解析 xx.rm.{ts,tsx,js,jsx} 名称的文件

## Example

[简单的例子](https://github.com/zebratt/mattlab/tree/master/umi-3.x)
