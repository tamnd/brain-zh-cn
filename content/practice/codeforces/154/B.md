---
title: "CF 154B - 对撞机"
description: "我们管理一组编号从 1 到 $n$ 的碰撞器。 最初，每个碰撞器都被关闭。 然后我们收到一系列命令。 命令可以尝试激活碰撞器或停用它。"
date: "2026-06-02T16:44:24+07:00"
tags: ["codeforces", "competitive-programming", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 154
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 109 (Div. 1)"
rating: 1600
weight: 154
solve_time_s: 32
verified: false
draft: false
---

[CF 154B - 碰撞体](https://codeforces.com/problemset/problem/154/B)

 **评分：** 1600
 **标签：** 数学，数论
 **求解时间：** 32s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们管理一组编号从 1 到$n$。 最初，每个碰撞器都被关闭。 然后我们收到一系列命令。 命令可以尝试激活碰撞器或停用它。 

安全规则是唯一重要的事情：所有活动的对撞机编号必须成对互质。 当我们尝试激活碰撞器时$x$，仅当每个当前活动的碰撞体的最大公约数等于 1 时才允许激活$x$。 如果某个活跃的对撞机与以下对象共享一个素因数：$x$，激活必须被拒绝，并且我们必须报告一个冲突的碰撞器。 如果碰撞器已经处于活动状态，我们会报告“已开启”。 

对于停用，行为更简单。 如果碰撞器当前处于活动状态，我们将其删除并打印“成功”。 否则我们打印“Already off”。 

约束足够大，简单的模拟是不够的。 两个都$n$和操作次数$m$可以达到$10^5$。 将新激活的对撞机与所有活动的对撞机进行比较的解决方案需要最多$10^5$每个操作的 gcd 计算。 在最坏的情况下，这大约变成$10^{10}$操作，这远远超出了两秒的时间限制。 

关键的观察是，冲突的产生是因为两个
