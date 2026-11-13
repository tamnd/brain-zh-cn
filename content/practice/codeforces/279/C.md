---
title: "CF 279C - 梯子"
description: "我们得到一个一维整数数组和一个查询列表，每个查询指定数组的一个连续子段。 对于每个查询，我们需要确定子段是否形成“梯子”。"
date: "2026-06-05T05:50:51+07:00"
tags: ["codeforces", "competitive-programming", "dp", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 279
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 171 (Div. 2)"
rating: 1700
weight: 279
solve_time_s: 87
verified: true
draft: false
---

[CF 279C - 阶梯](https://codeforces.com/problemset/problem/279/C)

 **评分：** 1700
 **标签：** dp、实现、两个指针
 **求解时间：** 1m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个一维整数数组和一个查询列表，每个查询指定数组的一个连续子段。 对于每个查询，我们需要确定子段是否形成“梯子”。 阶梯是一个单调增加（非减少）到某个点，然后在该点之后单调减少（非增加）的序列。 这意味着序列可能完全不减少、完全不增加，或者具有从不减少过渡到不增加的单个峰值。 如果子段是梯子，则输出为“是”，否则输出为“否”。 

约束告诉我们数组大小和查询数量都可以高达 100,000。 为每个查询单独扫描每个子段的简单方法在最坏的情况下需要检查多达 10^10 个元素，这远远超出了 2 秒内运行的时间。 这意味着我们需要一种方法来预处理数组以在恒定或对数时间内回答查询。 

当序列平坦、单元素或严格递增或递减时，就会出现边缘情况。 例如，一个数组`[5, 5, 5]`对于任何子段都应该返回“是”，因为它基本上是非减且非增的。 单元素子段`[7]`也是一个梯子。 当粗心的实现假设严格增加或减少而不是非严格比较时，就会出现问题。 

## 方法

 暴力方法迭代每个查询并直接检查相应的子段。 对于每个子段，它从左到右扫描以找到最长的非递减前缀，然后从末尾扫描以找到最长的非递增后缀。 如果这两个区域覆盖了整个子段，那么它就是一个阶梯。 这种方法工作正常，但在最坏的情况下时间复杂度为 O(n * m)，这对于给定的约束来说太慢了。 

优化的关键见解是，我们可以对数组进行一次预处理，以了解对于每个索引，非递减和非递增段延伸了多远。 具体来说，我们可以为每个位置计算在非递减的情况下向右移动可到达的最远索引（`up[i]`) 以及非递增时向右移动可到达的最远索引 (`down[i]`）。 然后，对于一个查询`[l, r]`， 如果`down[up[l]] >= r`，该段形成梯子。 这有效是因为`up[l]`查找起始非递减部分的末尾`l`， 和`down[up[l]]`从那里延伸非增加部分。 预处理以线性时间运行，并且每个查询在恒定时间内得到答复。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n + m) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个数组`up`长度`n`以非递减序列存储从每个位置可到达的最远索引。 从倒数第二个元素开始向左移动，更新`up[i]`到`i+1`如果`a[i] <= a[i+1]`， 否则`up[i] = i`。 
2.初始化一个数组`down`长度`n`以非递增序列存储从每个位置可到达的最远索引。 从倒数第二个元素开始向左移动，更新`down[i]`到`i+1`如果`a[i] >= a[i+1]`， 否则`down[i] = i`。 
3. 对于每个查询`[l, r]`，检查是否`down[up[l-1]] >= r-1`。 我们减一是因为 Python 中的数组索引是从 0 开始的。 如果为真，则打印“Yes”； 否则，打印“否”。 这有效是因为`up[l-1]`给出从以下位置开始的非递减线段的端点`l-1`， 和`down[up[l-1]]`从该峰值延伸不增加的部分。 如果达到或超过`r-1`，子段是一个梯子。 

为什么它有效：不变的是`up[i]`正确识别从以下位置开始的非递减序列的最大范围`i`， 和`down[i]`对于非递增序列执行相同的操作。 通过组合这两个预先计算的数组，我们可以在恒定时间内验证子段是否满足梯子属性，而无需重复扫描每个元素。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
a = list(map(int, input().split()))

up = [0] * n
down = [0] * n

up[-1] = n - 1
for i in range(n - 2, -1, -1):
    if a[i] <= a[i + 1]:
        up[i] = up[i + 1]
    else:
        up[i] = i

down[-1] = n - 1
for i in range(n - 2, -1, -1):
    if a[i] >= a[i + 1]:
        down[i] = down[i + 1]
    else:
        down[i] = i

for _ in range(m):
    l, r = map(int, input().split())
    l -= 1
    r -= 1
    if down[up[l]] >= r:
        print("Yes")
    else:
        print("No")
```第一个循环构造`up`通过从右向左扫描，确保每个索引都知道它可以到达的最远非递减段。 第二个循环构造`down`对于非递增序列也类似。 查询处理直接使用这些数组来确定每个查询在恒定时间内的梯形有效性。 基于 0 的 Python 数组的索引调整是常见的错误来源，但这里`l-1`和`r-1`妥善处理。 

## 工作示例

 ### 示例 1

 输入：`1 2 1 3 3 5 2 1`， 询问：`[1, 3]`| 我| 一个[我] | 向上[i] | 向下[i] |
 | --- | --- | --- | --- |
 | 0 | 1 | 1 | 2 |
 | 1 | 2 | 1 | 2 |
 | 2 | 1 | 2 | 2 |`up[0] = 1`指向2。`down[1] = 2`指向 1。由于 2 >= 2，所以答案为“是”。 

询问`[2, 4]`：`up[1] = 4`（扩展到5个），`down[4] = 4`（停在 3）。 由于 4 < 3 为假，因此答案为“否”。 这证明了非梯形段的正确检测。 

### 单元素段

 输入：`[7]`， 询问：`[1,1]`。`up[0] = 0`,`down[0] = 0`。 自从`down[up[0]] = 0 >= 0`，输出为“是”。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 预处理数组`up`和`down`需要 O(n)。 每个查询都在 O(1) 内得到答复。 |
 | 空间| O(n) | 数组`up`和`down`每个元素存储一个整数。 |

 给定约束 n、m ≤ 10^5，该算法非常高效，并且能够轻松满足 2 秒的时间限制和 256 MB 的内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution
    n, m = map(int, input().split())
    a = list(map(int, input().split()))

    up = [0] * n
    down = [0] * n

    up[-1] = n - 1
    for i in range(n - 2, -1, -1):
        if a[i] <= a[i + 1]:
            up[i] = up[i + 1]
        else:
            up[i] = i

    down[-1] = n - 1
    for i in range(n - 2, -1, -1):
        if a[i] >= a[i + 1]:
            down[i] = down[i + 1]
        else:
            down[i] = i

    for _ in range(m):
        l, r = map(int, input().split())
        l -= 1
        r -= 1
        if down[up[l]] >= r:
            print("Yes")
        else:
            print("No")
    return output.getvalue().strip()

# provided sample
assert run("8 6\n1 2 1 3 3 5 2 1\n1 3\n2 3\n2 4\n8 8\n1 4\n5 8\n") == "Yes\nYes\nNo\nYes\nNo\nYes"

# custom cases
assert run("1 1\n5\n1 1\n") == "Yes", "single element"
assert run("3 3\n1 1 1\n1 3\n1 2\n2 3\n") == "Yes\nYes\nYes", "all equal
```
