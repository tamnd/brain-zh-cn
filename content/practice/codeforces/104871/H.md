---
title: "CF 104871H - 人力资源"
description: "我们被赋予了一个公司层次结构，形成了有根树。 除一名员工外，每一位员工都只有一位经理，并且每位经理都有一份直接下属的有序列表，从最优先到最不优先排列。"
date: "2026-06-28T10:38:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104871
codeforces_index: "H"
codeforces_contest_name: "2023-2024 ICPC Central Europe Regional Contest (CERC 23)"
rating: 0
weight: 104871
solve_time_s: 39
verified: false
draft: false
---

[CF 104871H - 人力资源](https://codeforces.com/problemset/problem/104871/H)

 **评级：** -
 **标签：** -
 **求解时间：** 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被赋予了一个公司层次结构，形成了有根树。 除一名员工外，每一位员工都只有一位经理，并且每位经理都有一份直接下属的有序列表，从最优先到最不优先排列。 输入以结构化文本形式（编码模式）或紧凑的二进制字符串加员工姓名列表（解码模式）来描述该树。 

在ENCODE模式下，任务是将整个层次结构压缩为两部分。 首先，我们必须以任意顺序输出所有员工姓名。 其次，我们必须生成一个二进制字符串，对整个树结构进行编码，包括父子关系以及每个经理的子级顺序。 

在 DECODE 模式下，我们得到的正是该输出： nam 的无序列表
