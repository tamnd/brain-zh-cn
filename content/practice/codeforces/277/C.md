---
title: "CF 277C - 游戏"
description: "纸张的每条内部网格线都被格点划分为单位段。 沿网格线的切割将刀触及的所有单元段标记为已切割。 关键的观察是纸张的几何形状永远不会改变。"
date: "2026-06-05T23:17:14+07:00"
tags: ["codeforces", "competitive-programming", "games", "implementation"]
categories: ["algorithms"]
codeforces_contest: 277
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 170 (Div. 1)"
rating: 2400
weight: 277
solve_time_s: 153
verified: false
draft: false
---

[CF 277C - 游戏](https://codeforces.com/problemset/problem/277/C)

 **评分：** 2400
 **标签：** 游戏、实施
 **求解时间：** 2m 33s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 纸张的每条内部网格线都被格点划分为单位段。 沿网格线的切割将刀触及的所有单元段标记为已切割。 

关键的观察是纸张的几何形状永远不会改变。 棋子不会被移动，未来的切割只关心网格线的单位段是否已经被触及。 游戏状态只是仍未切割的单元网格段的集合。 

考虑一根内部垂直网格线。 它包含`m`单位段。 Existing cuts mark some intervals on that line as already cut. The remaining uncut unit segments form several disjoint contiguous runs. The same description applies to every interior horizontal grid line.

 A move chooses one grid line and cuts a contiguous interval on it. 在未切割的长度范围内`s`，这样的移动会删除一个连续的块，最多留下两个较小的未切割的运行。 

尺寸可以大到`10^9`，所以我们不能存储网格本身。 现有的削减数量仅为`10^5`，这意味着仅`O(k)`网格线可能与未触及的状态不同。 任何被接受的解决方案都必须仅根据剪切描述起作用。 

一个常见的错误是将每个输入剪辑视为一个独立的游戏组件。 必须首先合并重叠的切口。 

例如：```
3 3 2
1 0 1 2
1 1 1 3
```两个切口位于同一垂直线上并重叠。 他们的工会覆盖了整个生产线。 合并后，该线根本不贡献任何未切割的片段。 

另一个容易犯的错误是计算单个单元段而不是最大未切割运行。 

例子：```
3 3 1
1 1 1 2
```垂直线`x = 1`有未切割的长度`1`和`1`，不是一个单一的游程长度`2`。 Sprague-Grundy 值取决于游程分解。 

最后一个微妙的案例来自巨大的尺寸。 认为`n = 10^9`,`m = 10^9`， 和`k = 0`。 有数十亿条未触及的线路。 解决方案必须以数学方式聚合它们的贡献，而不是迭代它们。 

## 方法

 蛮力观点是将每个最大未切割运行视为游戏组件。 对于一个长度的运行`s`，移动会移除任何连续的块并留下两个较小的运行。 我们可以计算所有长度的 Sprague-Grundy 值，然后评估整个位置。 

这会立即失败，因为长度可以大到`10^9`。 即使存储 Grundy 值达到最大长度也是不可能的。 

关键的观察结果是，单次运行的游戏具有意外简单的 Grundy 函数。 

让`G(s)`是未切割长度的 Grundy 值`s`。 

一步步选择长度`l`和`r`对于幸存的左右部分，其中`l + r < s`。 因此$$G(s)=\operatorname{mex}\{G(l)\oplus G(r)\}.$$归纳地假设`G(t) = t`对于所有较小的长度。 然后$$G(s)=\operatorname{mex}\{l\oplus r \mid l+r<s\}.$$每个值来自`0`到`s-1`出现在该集合中，并且没有值`≥ s`可以出现。 因此$$G(s)=s.$$因此，每个未切割的运行的行为与 Nim 堆完全相同，其大小等于其长度。 

现在整个游戏变成了 Nim 位置。 总 Grundy 值只是所有内部网格线上所有最大未切割长度的 XOR。 

仅有的`O(k)`网格线受到切割的影响。 每隔一条垂直线贡献一堆大小`m`，并且每隔一条水平线贡献一堆大小`n`。 由于对同一值进行偶数次异或会抵消，因此可以使用奇偶校验来聚合未触及的行。 

剩下的工作是：

 1. 合并每条受影响线上的间隔。 
2. 计算补集中的最大未切割游程。 
3. 对它们的长度进行异或。 
4. 应用标准 Nim 制胜棋步。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 长度不可能达到$10^9$| 不可能| 太慢了 |
 | 最佳 |$O(k \log k)$|$O(k)$| 已接受 |

 ## 算法演练

 1. 将切口分成垂直组和水平组。 

垂直切割属于一条内部线`x = const`并覆盖了一个区间`y`轴。 水平切割属于一条内部线`y = const`并覆盖了一个区间`x`轴。 
2. 对于每条受影响的线，对其间隔进行排序并合并
