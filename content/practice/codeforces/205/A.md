---
title: "CF 205A - 小象和罗兹迪尔"
description: "我们得到了从 Rozdil 镇到其他 n 个城镇的旅行时间列表。 每个城镇有一个正整数时间，城镇编号为1到n。 目标是找到哪个城镇的旅行时间最短。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 205
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 129 (Div. 2)"
rating: 900
weight: 205
solve_time_s: 54
verified: true
draft: false
---

[CF 205A - 小象和罗兹迪尔](https://codeforces.com/problemset/problem/205/A)

 **评分：** 900
 **标签：** 暴力破解、实施
 **求解时间：** 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了从罗兹迪尔镇到其他每个城镇的旅行时间列表。 每个城镇都有一个正整数时间，城镇编号从1到_n_。 目标是找到哪个城镇的旅行时间最短。 如果有一个独特的城镇有这个最短时间，我们会打印它的编号。 如果有多个城镇都达到最小值，小象将留在罗兹迪尔，我们打印“仍然罗兹迪尔”。 

约束允许最多 100,000 个城镇，并且行程时间可以长达 10^9。 这告诉我们任何解决方案都必须在线性时间内运行； 对时间数组进行排序将是 O(n log n) 并且可以工作，但线性扫描更简单且足够。 二次复杂度的操作会太慢。 

当多个城镇的最短出行时间相同时，就会出现微妙的边缘情况。 例如，如果输入是`5\n4 2 2 5 6`，最短时间为 2，但它发生在两个城镇（2 和 3）。 粗心的实现可能只是返回它找到的第一个最小值，这是错误的。 当只有一个城镇时，会出现另一种边缘情况，在这种情况下，答案必须是该城镇，因为保证了唯一性。 

## 方法

 蛮力方法会遍历每个城镇，跟踪最小时间及其相应的城镇索引。 这是有效的，因为它直接实现了问题的要求：它确定最小值并检查联系。 从操作上来说，每次比较都是常数时间，所以总体时间是O(n)。 超出输入的内存使用量为 O(1)。 这种方法已经是最佳方法，但我们必须小心处理平局检测：如果我们需要检查唯一性，仅存储一个最小索引是不够的。 

关键的见解是，我们可以在扫描数组时维护三条信息：当前的最短旅行时间、首先达到该时间的城镇的索引以及该最小值发生次数的计数器。 每次遇到更小的时间，我们都会更新最小值，将索引设置为当前城镇，并将计数器重置为 1。如果遇到相等的最小值，我们会增加计数器。 最后，如果计数器大于 1，我们打印“Still Rozdil”； 否则，我们打印存储的索引。 这种方法是线性的，使用恒定的额外空间，并正确处理所有边缘情况，包括重复项和单元素数组。 

| 方法| 时间复杂度| 空间复杂度| 判决|
 | --- | --- | --- | --- |
 | 暴力破解与平局检测 | O(n) | O(1) | O(1) | 已接受 |
 | 排序和扫描| O(n log n) | O(n log n) | O(n) | 已接受但没有必要 |

 ## 算法演练

 1.初始化三个变量：`min_time`到一个非常大的数字，`min_index`至-1，并且`count`至 0。`min_time`将存储迄今为止发现的最小旅行时间。`min_index`将存储第一个达到此最小值的城镇的从 1 开始的索引。`count`将存储该最小值发生的次数。 
2. 使用带索引的循环迭代行程时间`i`从 0 到 n-1。 对于每个城镇，请阅读旅行时间。 
3. 如果当前行程时间小于`min_time`，这是一个新的最小值。 放`min_time`到这个值，`min_index`到`i + 1`（从基于 0 的索引转换为基于 1 的索引），并重置`count`至 1。 
4. 如果当前行程时间等于`min_time`, 增量`count`1，因为我们找到了另一个具有相同最小值的城镇。 
5. 扫描完所有城镇后，检查`count`。 如果`count`为1，打印`min_index`。 如果`count`大于 1，则打印“Still Rozdil”。 

工作原理：该算法始终跟踪最短旅行时间，并计算有多少个城镇达到了该时间。 通过仅在找到严格更小的时间时更新，我们确保`min_index`总是指向第一个具有最小值的城镇。 计算重复项可确保我们仅在确实存在时才声明唯一的最小值。 没有一个城镇被遗漏，因为我们对所有城镇都进行了一次迭代。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
times = list(map(int, input().split()))

min_time = 10**9 + 1
min_index = -1
count = 0

for i in range(n):
    t = times[i]
    if t < min_time:
        min_time = t
        min_index = i + 1
        count = 1
    elif t == min_time:
        count += 1

if count == 1:
    print(min_index)
else:
    print("Still Rozdil")
```第一部分使用快速 I/O 读取输入。`min_time`被初始化为大于任何可能的行程时间的值，以确保第一个城镇能够正确更新它。 在循环期间，我们维护当前最小值的索引和计数。 我们向索引添加 1，因为问题需要基于 1 的索引。 最后，我们检查计数以处理平局。 

## 工作示例

 ### 示例 1

 输入：`2\n7 4`| 我| t | 最短时间 | 最小索引 | 计数|
 | --- | --- | --- | --- | --- |
 | 0 | 7 | 7 | 1 | 1 |
 | 1 | 4 | 4 | 2 | 1 |

 最小值在城镇 2 是唯一的，因此输出为`2`。 该表显示，当找到新的最小值时，算法会正确更新。 

### 示例 2

 输入：`5\n4 2 2 5 6`| 我| t | 最短时间 | 最小索引 | 计数|
 | --- | --- | --- | --- | --- |
 | 0 | 4 | 4 | 1 | 1 |
 | 1 | 2 | 2 | 2 | 1 |
 | 2 | 2 | 2 | 2 | 2 |
 | 3 | 5 | 2 | 2 | 2 |
 | 4 | 6 | 2 | 2 | 2 |

 最小值出现在多个城镇，因此输出为`Still Rozdil`。 这演示了重复项的正确处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 我们只扫描一次旅行时间列表，对每个元素执行恒定时间操作。 |
 | 空间| O(n) | 我们存储旅行时间列表。 其他变量使用 O(1) 空间。 |

 该解决方案可以轻松满足 n 高达 100,000 的 2 秒限制，并且使用最少的内存。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    times = list(map(int, input().split()))
    min_time = 10**9 + 1
    min_index = -1
    count = 0
    for i in range(n):
        t = times[i]
        if t < min_time:
            min_time = t
            min_index = i + 1
            count = 1
        elif t == min_time:
            count += 1
    return str(min_index) if count == 1 else "Still Rozdil"

# Provided samples
assert run("2\n7 4\n") == "2", "sample 1"
assert run("5\n7 4 2 2 5\n") == "Still Rozdil", "sample 2"

# Custom cases
assert run("1\n10\n") == "1", "single town"
assert run("3\n5 5 5\n") == "Still Rozdil", "all equal values"
assert run("4\n3 2 4 2\n") == "Still Rozdil", "multiple minimums"
assert run("4\n7 1 3 4\n") == "2", "unique minimum in the middle"
assert run("5\n10 9 8 7 6\n") == "5", "minimum at the end"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1\n10 | 1 1 | 单城镇边缘案例 |
 | 3\n5 5 5 | 5 仍然是罗兹迪尔 | 所有城镇的出行时间均等 |
 | 4\n3 2 4 2 | 4\n3 2 4 2 仍然是罗兹迪尔 | 多个最小值 |
 | 4\n7 1 3 4 | 4\n7 2 | 列表中间的唯一最小值 |
 | 5\n10 9 8 7 6 | 5\n10 9 8 7 6 5 | 最后一个城镇的最低限度|

 ## 边缘情况

 该算法通过初始化来处理单城镇输入`min_time`高并在第一个城镇正确更新它。 重复的最小值通过递增处理`count`每次出现最小值时，确保平局触发“Still Rozdil”。 该算法还正确识别最后一个索引处出现的最小值，从而保持第一个找到的不变性和正确的索引。
