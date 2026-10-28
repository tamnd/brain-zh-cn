---
title: "CF 1467B - 丘陵和山谷"
description: "我们给出了一个整数序列，需要识别其中的“山丘”和“山谷”。 如果位置 j 的数量严格大于两个邻居，则在位置 j 处出现山丘，而如果严格小于两个邻居，则出现山谷。"
date: "2026-06-11T01:38:31+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1467
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 695 (Div. 2)"
rating: 1700
weight: 1467
solve_time_s: 103
verified: true
draft: false
---

[CF 1467B - 丘陵和山谷](https://codeforces.com/problemset/problem/1467/B)

 **评分：** 1700
 **标签：** 暴力破解、实施
 **求解时间：** 1m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一个整数序列，需要识别其中的“山丘”和“山谷”。 位置出现一座小山`j`如果那里的数字严格大于两个邻居，则如果它严格小于两个邻居，则会出现山谷。 序列中山丘和山谷的总和称为恐吓值。 我们可以将序列中的一个数字更改为任何整数，或者保持序列不变，并且我们希望在这一单个更改之后获得最小可能的恐吓值。 

输入由多个测试用例组成。 每个测试用例提供序列的长度和序列本身。 每个测试用例的输出是一个数字：可实现的最小恐吓值。 

约束条件是所有测试用例的所有序列的总长度不超过 300,000。 由于每个测试用例最多可包含 300,000 个元素，$O(n^2)$方法会太慢。 我们需要一个与每个序列的大小呈线性或接近线性的解决方案。 

当序列具有很少的元素时，例如三个元素，其中只有中间元素可以是山或谷，或者所有数字都相等的序列（其中有零个山和谷），就会出现边缘情况。 粗心的实现可能会尝试在不检查边界的情况下调整元素，或者如果忽略相邻的更改，可能会错误地计算山丘和山谷。 

## 方法

 暴力方法迭代序列中的每个可能的位置，尝试将其更改为每个可能的整数，重新计算整个恐吓值，并保留最小值。 这种做法原则上是正确的，但完全不切实际。 如果我们尝试测试所有值$10^9$对于每个元素，操作数量呈爆炸式增长，远远超出了可行的限制。 

优化的关键见解来自于观察，即更改数字只会影响其紧邻的山丘和山谷，特别是索引本身及其两个相邻索引。 因此，我们不需要每次都重新计算整个序列； 我们只需要考虑变化元素周围丘陵和山谷的局部贡献。 

我们可以预先计算整个序列的初始山丘和山谷。 然后对于每个候选位置`i`（除了第一个和最后一个元素），我们考虑三个选项：更改它以匹配左邻居，匹配右邻居，或保持不变。 对于每个选项，我们计算当地丘陵和山谷的变化（在索引`i-1`,`i`， 和`i+1`）。 我们采取最大程度降低总恐吓值的选项。 对每个位置重复此操作，并跟踪线性时间解决方案中的最小结果。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * 值范围) | O(n) | 太慢了|
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量。 对于每个测试用例，请阅读`n`和数组`a`。 
2. 定义辅助函数`is_hill_or_valley(i)`返回`1`如果`a[i]`是一座小山或山谷，并且`0`否则。 这检查是否`a[i] > a[i-1]`和`a[i] > a[i+1]`或者`a[i] < a[i-1]`和`a[i] < a[i+1]`。 
3. 通过求和预先计算初始总恐吓值`is_hill_or_valley(i)`为所有人`2 ≤ i ≤ n-1`。 
4. 初始化`best_reduction`为零。 这将存储我们通过一次更改可以实现的恐吓值的最大减少量。 
5. 迭代索引`i`从 1 到`n-2`（基于 0 的索引，忽略第一个和最后一个元素）：

 1. 计算当前位置的山丘和山谷总和`i-1`,`i`， 和`i+1`。 
2.尝试改变`a[i]`到`a[i-1]`。 计算位置处的新总和`i-1`,`i`， 和`i+1`。 计算减少量：旧总和减去新总和。 更新`best_reduction`如果这个更大。 
3. 改变重复`a[i]`到`a[i+1]`。 
6. 最小恐吓值是`initial_total - best_reduction`。 打印它作为测试用例。 

为什么有效：更改数字只会影响其直接邻居。 通过评估所有相关的局部修改并采取最大程度地减少局部总和的修改，我们保证找到最佳的单次更改减少。 除了这些本地社区之外，不需要进行全局重新计算。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def is_hill_or_valley(a, i):
    return (a[i] > a[i-1] and a[i] > a[i+1]) or (a[i] < a[i-1] and a[i] < a[i+1])

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        if n < 3:
            print(0)
            continue
        hills_valleys = [0] * n
        total = 0
        for i in range(1, n-1):
            if is_hill_or_valley(a, i):
                hills_valleys[i] = 1
                total += 1
        best_reduction = 0
        for i in range(1, n-1):
            original = [hills_valleys[j] for j in range(max(0,i-1), min(n,i+2))]
            current_sum = sum(original)
            for new_val in [a[i-1], a[i+1]]:
                old = a[i]
                a[i] = new_val
                new = [1 if 1 <= j <= n-2 and is_hill_or_valley(a, j) else 0 for j in range(max(0,i-1), min(n,i+2))]
                reduction = current_sum - sum(new)
                best_reduction = max(best_reduction, reduction)
                a[i] = old
        print(total - best_reduction)

if __name__ == "__main__":
    solve()
```该代码预先计算了山丘和山谷`hills_valleys`。 嵌套循环结束`i`测试改变`a[i]`符合其邻居的价值观。 使用切片确保我们只重新计算局部效果`i-1`,`i`,`i+1`。 正在恢复`a[i]`每次尝试之后避免迭代之间的副作用。 特殊处理`n < 3`避免索引错误。 

## 工作示例

 ### 示例 1

 输入：`[1, 5, 3]`初始山丘/山谷：索引 1 是一座山丘 (5 > 1, 5 > 3)，总计 = 1。 

改变`5`到`1`或者`3`移除山丘。 

减少 = 1，最终最小恐吓值 = 0。 

| 我| a[i] 改变 | 当地老总| 本地新总和| 减少| 最佳缩减 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 0 | 1 | 1 |
 | 1 | 3 | 1 | 0 | 1 | 1 |

 ### 示例 2

 输入：`[2, 2, 2, 2, 2]`所有元素相等，没有山丘或山谷，总计 = 0。 

任何改变都无法进一步改善总数。 输出 = 0。 

| 我| a[i] 改变 | 当地老总| 本地新总和| 减少| 最佳缩减 |
 | --- | --- | --- | --- | --- | --- |
 | 1..3 | 1..3 2（邻居）| 0 | 0 | 0 | 0 |

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个索引最多检查两次，并进行恒定时间邻域计算 |
 | 空间| O(n) | 为每个索引存储山丘和山谷|

 每个测试用例的线性时间确保`n`在所有 ≤ 300,000 个测试用例中，解决方案在 1 秒内顺利运行。 内存使用呈线性，符合 256 MB 限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# Provided samples
assert run("4\n3\n1 5 3\n5\n2 2 2 2 2\n6\n1 6 2 5 2 10\n5\n1 6 2 5 1\n") == "0\n0\n1\n0"

# Minimum size input
assert run("1\n1\n100\n") == "0", "single element"

# Two elements, no hills or valleys
assert run("1\n2\n3 3\n") == "0", "two elements"

# Maximum-size input, all equal
assert run(f"1\n300000\n{' '.join(['1']*300000)}\n") == "0", "all equal large"

# Peaks at boundaries
assert run("1\n5\n10 1 10 1 10\n") == "1", "alternating peaks"

# Random peaks
assert run("1
```
