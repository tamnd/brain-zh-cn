---
title: "CF 1302C - 线段树还是 Fenwick？"
description: "我们被要求维护一个以全零开头的整数数组并回答一系列查询。 每个查询要么是一个赋值，将特定元素设置为一个值，要么是一个范围求和查询，要求连续子数组的总和。"
date: "2026-06-11T18:10:10+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 1302
codeforces_index: "C"
codeforces_contest_name: "AIM Tech Poorly Prepared Contest (unrated, funny, Div. 1 preferred)"
rating: 0
weight: 1302
solve_time_s: 106
verified: true
draft: false
---

[CF 1302C - 线段树或 Fenwick？](https://codeforces.com/problemset/problem/1302/C)

 **评级：** -
 **标签：** 数据结构
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求维护一个以全零开头的整数数组并回答一系列查询。 每个查询要么是一个赋值，将特定元素设置为一个值，要么是一个范围求和查询，要求连续子数组的总和。 有多个独立的测试用例，每个测试用例都有自己的数组和查询。 输出只是按顺序求和查询的结果。 

约束很严格：数组长度和每个测试用例的查询数量都可以达到$10^5$，所有测试用例的总和可以达到$10^6$。 这排除了为每个总和查询扫描范围的简单方法。 一个天真的解决方案需要$O(n)$每次总和查询，导致最多$10^{11}$在最坏的情况下进行操作，远远超出任何合理的时间限制。 

当查询在任何更新之前要求整个数组的总和时，就会出现微妙的边缘情况。 在这种情况下，假设值已初始化的粗心实现可能会尝试读取未初始化的内存或计算错误，但正确的总和为零。 另一个边缘情况是重复更新同一位置，这必须覆盖以前的值而不是累积。 

## 方法

 暴力法很简单。 我们显式地维护数组并以明显的方式处理每个查询。 作业完成于$O(1)$time，但是sum查询需要从左索引迭代到右索引，即$O(n)$在最坏的情况下。 和$q$查询，整体复杂度可达$O(nq)$，这对于大量输入来说太慢了。 

提高性能的关键在于我们只需要支持点更新和范围求和查询。 这与 Fenwick 树（二元索引树）或线段树的功能完全匹配。 两种数据结构都允许点更新$O(\log n)$和范围总和查询$O(\log n)$。 对于此类查询，Fenwick Tree 实现起来更简单，并且在实践中速度稍快。 

关键的观察是数组值仅被替换，而不是递增。 对于芬威克树，我们可以将当前值存储在单独的数组中，以计算每次分配的差异，然后将该差异传播到树中。 这使得每个查询都可以在$O(\log n)$，这使总操作保持在$10^7$对于问题的约束。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(n) | 太慢了|
 | 芬威克树| O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

 1. 每个测试用例初始化两个数组：用于存储当前值的主数组和用于高效前缀和的 Fenwick Tree 数组。 这建立了一个可以有效处理赋值和范围查询的结构。 
2. 对于类型 1 查询，`1 x y`，计算新值之间的差`y`以及该位置的当前值`x`。 更新位置上的主数组`x`与新的价值。 然后通过芬威克树传播这种差异。 传播差异可确保未来的范围总和查询反映更新后的值，而无需从头开始重新计算总和。 
3. 对于类型 2 查询，`2 l r`，计算前缀和`r`在芬威克树中减去前缀总和`l-1`。 这给出了子数组的总和`[l, r]`。 输出这个值。 
4. 对每个查询和每个测试用例独立重复上述步骤。 

工作原理：Fenwick 树保持每个节点存储数组的部分和的不变式。 当我们更新一个值时，差异会传播到所有相关节点，确保任何前缀和查询返回正确的总数。 范围和查询只是两个前缀和的差，这在数学上相当于元素的直接和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def add(bit, i, delta):
    n = len(bit)
    while i < n:
        bit[i] += delta
        i += i & -i

def prefix_sum(bit, i):
    result = 0
    while i > 0:
        result += bit[i]
        i -= i & -i
    return result

def main():
    T = int(input())
    for _ in range(T):
        n, q = map(int, input().split())
        arr = [0] * (n + 1)
        bit = [0] * (n + 1)
        for _ in range(q):
            query = input().split()
            if query[0] == '1':
                x, y = int(query[1]), int(query[2])
                delta = y - arr[x]
                arr[x] = y
                add(bit, x, delta)
            else:
                l, r = int(query[1]), int(query[2])
                result = prefix_sum(bit, r) - prefix_sum(bit, l - 1)
                print(result)

if __name__ == "__main__":
    main()
```该解决方案首先定义辅助函数来更新 Fenwick 树并计算前缀和。 这`add`函数通过所有相关节点传播增量。`prefix_sum`向后遍历树以求相关值的总和。 在主循环中，我们读取每个测试用例，初始化数组和树，并根据其类型处理每个查询。 关键的微妙之处在于计算差异`delta`以便作业保持正确性。 

## 工作示例

 **样品1**

 | 步骤| 查询 | 到达 | 比特 | 输出|
 | ---| ---| ---| ---| ---|
 | 1 | 2 1 6 | [0,0,0,0,0,0,0] | [0,0,0,0,0,0,0] | 0 |
 | 2 | 1 3 2 | 1 3 2 [0,0,2,0,0,0,0] | [0,0,2,2,0,0,0] | |
 | 3 | 2 2 4 | 2 2 4 [0,0,2,0,0,0,0] | [0,0,2,2,0,0,0] | 2 |
 | 4 | 1 6 3 | 1 6 3 [0,0,2,0,0,0,3] | [0,0,2,2,0,0,3] | |
 | 5 | 2 1 6 | [0,0,2,0,0,0,3] | [0,0,2,2,0,0,3] | 5 |

 这表明该算法可以正确更新值并计算任意范围内的总和。 

**样品2**

 | 步骤| 查询 | 到达 | 比特 | 输出|
 | ---| ---| ---| ---| ---|
 | 1 | 1 3 7 | 1 3 7 [0,0,7,0,0,0] | [0,0,7,7,0,0] | |
 | 2 | 1 1 4 | 1 1 4 [0,4,7,0,0,0] | [0,4,7,11,0,0] | |
 | 3 | 2 1 5 | 2 1 5 [0,4,7,0,0,0] | [0,4,7,11,0,0] | 11 | 11

 在这里我们看到多个更新在 Fenwick Tree 中正确累积，并且范围和计算使用前缀和的差值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n+q) log n) | O((n+q) log n) | 每个查询需要 O(log n) 进行更新或求和； 每个测试用例初始化数组的时间复杂度为 O(n)。 |
 | 空间| O(n) | 我们存储每个测试用例的数组和芬威克树。 |

 鉴于总和`n`和`q`所有测试用例最多$10^6$，总操作如下$2 \cdot 10^6 \cdot \log 10^5 \approx 2 \cdot 10^6 \cdot 17$，完全符合 2 秒限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    main()
    return out.getvalue().strip()

# Provided samples
assert run("2\n6 5\n2 1 6\n1 3 2\n2 2 4\n1 6 3\n2 1 6\n5 3\n1 3 7\n1 1 4\n2 1 5\n") == "0\n2\n5\n11", "sample 1"

# Minimum-size input
assert run("1\n1 2\n2 1 1\n1 1 5\n") == "0", "min size"

# Maximum-size input: all zeros, sum query entire array
n = 100000
q = 1
inp = f"1\n{n} {q}\n2 1 {n}\n"
assert run(inp) == "0", "max size, all zeros"

# Repeated updates
assert run("1\n3 5\n1 1 5\n1 1 10\n2 1 1\n
```
