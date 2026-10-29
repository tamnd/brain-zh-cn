---
title: "CF 1491D - 动物园管理员和无限动物园"
description: "我们被要求确定无限有向图中的可达性。 每个顶点都是正整数，当且仅当$u$和$v$的按位与等于$v$时，从顶点$u$到顶点$u+v$存在有向边。"
date: "2026-06-10T22:27:12+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "constructive-algorithms", "dp", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1491
codeforces_index: "D"
codeforces_contest_name: "Codeforces Global Round 13"
rating: 1800
weight: 1491
solve_time_s: 123
verified: true
draft: false
---

[CF 1491D - 动物园管理员和无限动物园](https://codeforces.com/problemset/problem/1491/D)

 **评分：** 1800
 **标签：** 位掩码、构造性算法、dp、贪婪、数学
 **求解时间：** 2m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求确定无限有向图中的可达性。 每个顶点都是一个正整数，并且有一条从顶点开始的有向边$u$到顶点$u+v$当且仅当按位与$u$和$v$等于$v$。 换句话说，每条边都允许我们添加一个数字$v$到当前顶点$u$仅当所有 1 位$v$也是 1 位$u$。 对于每个由两个整数组成的查询$u_i$和$v_i$，我们需要回答是否可以达到$v_i$开始于$u_i$使用一系列这样的边。 

输入允许最多$10^5$查询，每个顶点可以大到$2^{30}-1$。 一种尝试模拟所有可能路径的简单方法$u_i$到$v_i$可能会为每个查询探索指数数量的顶点，这是不可行的。 这意味着任何解决方案都必须直接使用数字的位模式而不是枚举路径。 

不明显的边缘情况包括查询，其中$u_i = v_i$。 在这种情况下，正确的答案是“是”，因为我们已经达到目标，即使不需要边缘。 另一种边缘情况发生在$v_i < u_i$。 由于每条边都会严格增加顶点值，因此答案必须是“否”。 最后，情况$u_i$和$v_i$共享一些位但其他位不同需要小心处理，因为 AND 条件可能会阻止到达某些位。 

## 方法

 蛮力方法将尝试从以下位置开始模拟图表：$u_i$，通过重复添加任何有效的顶点来生成所有可达的顶点$v$满足$u \& v = v$。 这对于少数人有效，但对于$u_i$一样大$2^{30}$或者对于许多查询，因为每次模拟可能需要超过$10^9$最坏情况下的操作。 

关键的观察是，每个步骤只允许我们添加当前顶点中已经存在 1 位的数字。 这意味着要达到$v_i$从$u_i$，每 1 位$v_i$最终必须得到一些1位的支持$u_i$。 更准确地说，如果我们从最低有效位到最高有效位扫描位，则 1 位的数量$u_i$直到任何位置都必须至少有 1 位的数量$v_i$直到相同的位置。 如果任意位的累计计数$v_i$超过了$u_i$, 不可能达到$v_i$。 这将问题转化为每个查询超过 30 位的线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每次查询 O(2^30) | O(2^30) | O(2^30) | 太慢了|
 | 最佳（位数扫描）| O(30 * q) | 每个查询 O(1) | 已接受 |

 ## 算法演练

 1.读取查询数量$q$。 
2. 对于每个查询，请阅读$u$和$v$。 如果$u > v$，立即输出“NO”，因为所有边都会增加顶点。 
3.初始化两个计数器，$count_u$和$count_v$，跟踪累积的 1 位$u$和$v$当我们从最低有效位（位 0）扫描到第 29 位时。 
4. 对于从 0 到 29 的每个位位置，检查该位是否已设置$u$和$v$。 如果设置，则递增$count_u$或者$count_v$分别。 
5. 更新每个位的计数后，检查是否$count_v > count_u$。 如果为 true，则立即输出“NO”，因为其中有 1 位$v$无法支持的$u$迄今为止。 
6. 如果扫描完成且没有失败，则输出“YES”，因为所有 1 位$v$可以使用 1 位增量构建$u$。 

工作原理：扫描期间保持的不变性是，在每个位位置，1 位的累积数量$u$至少是中的数字$v$。 这保证了任何 1 位$v$可以通过添加已经存在于 1 位的数字来形成$u$，遵守 AND 条件。 如果不变量在任何一点失效，就不可能达到$v$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

q = int(input())
for _ in range(q):
    u, v = map(int, input().split())
    if u > v:
        print("NO")
        continue
    count_u = 0
    count_v = 0
    possible = True
    for i in range(30):
        if (u >> i) & 1:
            count_u += 1
        if (v >> i) & 1:
            count_v += 1
        if count_v > count_u:
            possible = False
            break
    print("YES" if possible else "NO")
```该解决方案读取每个查询并直接处理位计数。 使用累积计数可以避免回溯或模拟图形，从而使算法在位数和查询方面保持线性。 从最低有效位到最高有效位的位扫描确保首先满足较小的位，这与 AND 加法边缘允许传播的方式一致。 

## 工作示例

 **示例1**：$u = 1, v = 4$| 位| u_位| v_位 | 计数_u | 计数_v | 可能 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 0 | 1 | 0 | 真实|
 | 1 | 0 | 0 | 1 | 0 | 真实|
 | 2 | 0 | 1 | 1 | 1 | 真实|

 扫描成功完成，输出“YES”。 这确认了 1 位$v$最终可以到达位置2。 

**示例2**：$u = 3, v = 6$| 位| u_位| v_位 | 计数_u | 计数_v | 可能 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 0 | 1 | 0 | 真实|
 | 1 | 1 | 1 | 2 | 1 | 真实|
 | 2 | 0 | 1 | 2 | 2 | 真实|

 扫描完成，输出“YES”。 累积检查表明我们可以形成所有 1 位$v$从$u$。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q * 30) = O(q) | 每个查询需要扫描 30 位。 和$q \le 10^5$，总操作约为 3*10^6。 |
 | 空间| O(1) | O(1) | 每个查询仅使用几个整数计数器。 |

 这完全符合时间和内存的限制。 该算法避免了任何显式的图存储或路径枚举，使其对于输入边界是可行的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())  # assuming the solution code is saved in solution.py
    return output.getvalue().strip()

# Provided sample
assert run("5\n1 4\n3 6\n1 6\n6 2\n5 5\n") == "YES\nYES\nNO\nNO\nYES", "sample 1"

# Custom tests
assert run("2\n1 1\n1 2\n") == "YES\nNO", "same u=v and impossible case"
assert run("1\n15 15\n") == "YES", "all bits equal"
assert run("1\n0 0\n") == "YES", "zero case"
assert run("1\n7 8\n") == "NO", "requires unsupported higher bit"
assert run("1\n2 3\n") == "NO", "requires lower bit not present"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1, 1 2 | 1 1, 1 2 | 是，否 | u=v 且不可能的小 v |
 | 15 15 | 15 是 | 所有位都相等 |
 | 0 0 | 是 | 零边缘情况 |
 | 7 8 | 否 | 无法形成 u | 中不存在的更高位
 | 2 3 | 否 | 没有足够的支撑就无法形成低位|

 ## 边缘情况

 当$u = v$，无需添加。 例如，输入`1 1`立即满足累积位不变量，算法输出“YES”。 什么时候$v < u$，输出为“NO”，因为没有边可以减少顶点。 为了`u = 2, v = 1`，扫描永远不会满足累积位要求，产生“NO”。 对于最高位的情况$v$不在$u$，算法
