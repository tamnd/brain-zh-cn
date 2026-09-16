---
title: "CF 105556I - \u68cb\u76d8"
description: "我们有一个 $n × m$ 棋盘和一个总是恰好覆盖三个单元格的拼图。 关键的几何观察是，如果我们像标准棋盘一样为棋盘着色，则每个有效的棋子位置都会覆盖三个相同颜色的单元格。"
date: "2026-06-25T06:08:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105556
codeforces_index: "I"
codeforces_contest_name: "The 6th FanRuan Cup Southeast University Programming Contest (Winter)"
rating: 0
weight: 105556
solve_time_s: 50
verified: true
draft: false
---

[CF 105556I - \u68cb\u76d8](https://codeforces.com/problemset/problem/105556/I)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个$n \times m$棋盘和一块始终恰好覆盖三个单元格的拼图。 

关键的几何观察是，如果我们像标准棋盘一样为棋盘着色，则每个有效的棋子位置都会覆盖三个相同颜色的单元格。 一旦发现了这一特性，原来的堆积问题就变成了黑白细胞的计数问题。 

让$B$是黑细胞的数量，$W$是板上白细胞的数量。 

每一块恰好消耗一种颜色的三个单元，因此没有解决方案可以使用超过$$\left\lfloor \frac{B}{3} \right\rfloor +
\left\lfloor \frac{W}{3} \right\rfloor$$件。 

剩下的问题是这个上限是否总是可以实现的。 官方提示指向一个建设性的论点：按颜色分隔单元格后，每个颜色类别形成一个连接的网格图。 连通图与$k$顶点可以分为任意多个不相交的连通分量$3$尽可能保留少于三个未使用的顶点。 这意味着每个颜色类别都可以准确地实现$\lfloor k/3 \rfloor$件。 组合两种颜色即可达到上限。 

从计算角度来看，电路板尺寸很小。 一旦知道了公式，只需要进行一些算术运算即可。 

一个常见的错误是假设答案很简单$\lfloor nm/3 \rfloor$。 颜色很重要。 

例如，在一个$2 \times 2$木板：```
B W
W B
```有两个黑色单元格和两个白色单元格。$$\left\lfloor \frac{2}{3} \right\rfloor +
\left\lfloor \frac{2}{3} \right\rfloor = 0$$尽管$$\left\lfloor \frac{4}{3} \right\rfloor = 1$$因此，将所有细胞放在一起会得到错误的结果。 

当黑色和白色细胞的数量不同时，另一个容易出现的陷阱就会出现。 

对于一个$3 \times 3$木板：$$B = 5,\quad W = 4$$和$$\left\lfloor \frac{5}{3} \right\rfloor +
\left\lfloor \frac{4}{3} \right\rfloor
= 1 + 1 = 2.$$仅使用$\lfloor 9/3 \rfloor = 3$会高估答案。 

## 方法

 强力方法会尝试枚举棋子的位置并搜索最大包装。 即使对于中等尺寸的电路板，这也是不可行的，因为可能的配置数量呈指数级增长。 

关键的观察完全改变了问题。 

将棋盘着色为棋盘图案后，每块棋子占据三个相同颜色的单元格。 这立即将董事会分成两个独立的资源：黑色单元和白色单元。 

如果颜色类包含$k$细胞，每块正好消耗三个细胞，所以最多$\lfloor k/3 \rfloor$可以用该颜色形成碎片。 

剩下的步骤是证明这个上限是可以实现的。 提示中的连通性参数保证了一组连通的$k$单元始终可以划分为尽可能多的连接三元组，最多留下两个未使用的单元。 因此每种颜色的贡献完全相同$\lfloor k/3 \rfloor$件。 

剩下的就是计算黑色和白色单元格的数量：$$B = \left\lceil \frac{nm}{2} \right\rceil,
\qquad
W = \left\lfloor \frac{nm}{2} \right\rfloor.$$答案就变成了$$\left\lfloor \frac{B}{3} \right\rfloor +
\left\lfloor \frac{W}{3} \right\rfloor.$$| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| --- | ---| --- |
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读$n$和$m$。 
2. 计算细胞总数。$$S = n \times m$$1. 计算黑色单元格的数量。$$B = \frac{S + 1}{2}$$使用整数除法。 

1. 计算白细胞的数量。$$W = \frac{S}{2}$$使用整数除法。 

1. 计算$$\left\lfloor \frac{B}{3} \right\rfloor +
\left\lfloor \frac{W}{3} \right\rfloor.$$1. 输出结果。 

### 为什么它有效

 每个棋子恰好占据同一棋盘颜色的三个单元格。 颜色类别$k$细胞的贡献不能超过$\lfloor k/3 \rfloor$碎片，因为每个碎片消耗三个细胞。 

颜色类别是连接的网格图。 连通图与$k$顶点可以重复地分成大小为 3 的连通分量，留下少于 3 个未使用的顶点。 因此每个颜色类别都可以准确地实现$\lfloor k/3 \rfloor$件。 

由于黑色和白色单元格是独立的，因此最大块数为$$\left\lfloor \frac{B}{3} \right\rfloor +
\left\lfloor \frac{W}{3} \right\rfloor.$$## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())

s = n * m
black = (s + 1) // 2
white = s // 2

print(black // 3 + white // 3)
```直接按照公式执行即可。 

表达式`(s + 1) // 2`计算棋盘上较大的颜色类别，即单元格总数为奇数时的黑色计数。 

表达式`s // 2`计算较小的颜色类别。 

整数除以三给出每个颜色类别中可用的完整三元组的数量。 将这两个值相加即可得到答案。 

不需要循环、递归或大型数据结构。 

## 工作示例

 ### 示例 1

 输入：```
2 2
```细胞总数：$$S = 4$$| 变量| 价值|
 | --- | --- |
 | S | 4 |
 | 乙| 2 |
 | 西 | 2 |
 | B // 3 | 0 |
 | W // 3 | 0 |
 | 回答 | 0 |

 棋盘上每种颜色仅包含两个单元格，因此没有一种颜色有足够的单元格来形成一块。 

### 示例 2

 输入：```
3 3
```| 变量| 价值|
 | --- | --- |
 | S | 9 |
 | 乙| 5 |
 | 西 | 4 |
 | B // 3 | 1 |
 | W // 3 | 1 |
 | 回答 | 2 |

 黑方格可以组成一个三元组，白方格可以组成一个三元组。 一个黑色单元格和一个白色单元格保持未使用。 

这个例子说明了为什么答案不简单$\lfloor 9/3 \rfloor = 3$。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 只有一些算术运算 |
 | 空间| O(1) | O(1) | 使用恒定的额外内存 |

 无论电路板大小如何，该解决方案都会执行固定量的工作，因此它可以轻松满足任何合理的竞赛限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    n, m = map(int, sys.stdin.readline().split())
    s = n * m
    black = (s + 1) // 2
    white = s // 2

    return str(black // 3 + white // 3)

# custom cases

assert run("1 1\n") == "0", "minimum board"

assert run("2 2\n") == "0", "not enough cells of either color"

assert run("3 3\n") == "2", "odd-sized board"

assert run("3 4\n") == "4", "equal color counts"

assert run("100000 100000\n") == str(((100000 * 100000 + 1) // 2) // 3 + ((100000 * 100000) // 2) // 3), "large values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`|`0`| 尽可能小的董事会|
 |`2 2`|`0`| 不能用任何一种颜色组成三元组 |
 |`3 3`|`2`| 奇数个单元格 |
 |`3 4`|`4`| 黑白同等重要|
 |`100000 100000`| 公式值| 大数算术 |

 ## 边缘情况

 考虑输入```
2 2
```该板包含两个黑色单元格和两个白色单元格。 

该算法计算$$B=2,\quad W=2$$并返回$$0+0=0.$$一个简单的解决方案使用$\lfloor nm/3 \rfloor$会回来$1$，这是不可能的，因为没有颜色类包含三个单元格。 

现在考虑```
3 3
```该算法计算$$B=5,\quad W=4.$$答案就变成了$$\left\lfloor \frac{5}{3} \right\rfloor +
\left\lfloor \frac{4}{3} \right\rfloor
=2.$$剩下的单元格是一个黑色单元格和一个白色单元格，它们都不能参与另一块。 该公式自然可以处理这种剩余情况。 

最后，对于具有偶数个单元的板，例如```
3 4
```我们得到$$B=W=6.$$答案是$$6/3 + 6/3 = 4.$$两种颜色类别都被完全使用，表明该公式也可以处理没有剩余的情况。
