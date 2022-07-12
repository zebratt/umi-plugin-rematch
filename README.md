# umi-plugin-rematch

[![NPM version](https://img.shields.io/npm/v/umi-plugin.svg?style=flat)](https://npmjs.org/package/umi-plugin) [![NPM downloads](http://img.shields.io/npm/dm/umi-plugin.svg?style=flat)](https://npmjs.org/package/umi-plugin)

Rematch plugin for umi@4.x

# Intro

默认集成了 Immer 插件，开启方式为配置开启，即在 plugins 内添加了就会自动开启

## Usage

1. yarn add umi-plugin-rematch -D
2. yarn add @rematch/core @rematch/immer react-redux
3. 在 src 目录下任意层级创建 models 目录
4. models 内下创建 model: xxx.rm.ts

支持解析 xx.rm.{ts,tsx,js,jsx} 名称的文件

## Example

[简单的例子](https://github.com/zebratt/mattlab/tree/master/umi-3.x)
