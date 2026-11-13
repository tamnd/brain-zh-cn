---
title: "CF 237A - 免费现金"
description: "我们被要求确定 Valera 的快餐店需要多少台收银机，以便可以立即为每位访客提供服务，假设每位访客在一天中的特定时间到达，并且每次服务所需时间不到一分钟。"
date: "2026-06-04T16:42:18+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 237
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 147 (Div. 2)"
rating: 1000
weight: 237
solve_time_s: 207
verified: true
draft: false
---

[CF 237A - 免费现金](https://codeforces.com/problemset/problem/237/A)

 **评分：** 1000
 **标签：** 实施
 **求解时间：** 3m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求确定 Valera 的快餐店需要多少台收银机，以便可以立即为每位访客提供服务，假设每位访客在一天中的特定时间到达，并且每次服务所需时间不到一分钟。 第一行之后的每个输入行都会给出顾客到达的小时和分钟。 输出是一个整数：同时到达的最大人数，因为这是避免任何顾客离开所需的现金数量。 

约束让`n`最多可达 100,000，并且时间按时间顺序提供。 这意味着任何对所有客户进行一次迭代或使用从次数到计数的映射的解决方案都是可以接受的。 一个简单的解决方案是比较每对客户的重叠时间，大约需要`n^2`操作，这在上限是不可行的`n`。 

需要注意的主要边缘情况是多个客户在完全相同的时间到达、客户按顺序到达而不重叠，以及单个客户的最小可能输入。 例如，如果三个客户在 8:00 到达，另外两个客户在 9:00 到达，则正确的输出为 3，即使总共只有 5 个客户。 粗心的实现可能会对到达次数进行求和，而不是取最大并发到达次数。 

## 方法

 暴力方法是将每个客户与其他客户进行比较，并计算有多少个客户共享相同的时间戳。 这是正确的，因为问题减少到计算同时到达的数量，但它的执行情况大致如下`n^2`最坏情况下的比较，对于`n = 10^5`。 

最佳方法利用了输入已经按时间顺序排列的事实。 我们可以迭代一次，跟踪共享同一小时和分钟的连续客户的数量。 每当我们遇到新的时间时，我们都会重置计数器。 计数器在本次迭代期间达到的最大值是所需的最小现金数量。 这种方法既简单又在时间上呈线性，`O(n)`，因为我们只对每个客户处理一次，并且只对每个客户执行恒定时间操作。 

关键的见解是，由于时间是排序的，所以同时到达的所有客户都是连续的。 这意味着我们不需要哈希图或任何复杂的数据结构； 一个简单的计数器就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.初始化一个计数器`current_count`到 1，代表第一个客户，并且`max_count`为 1，这将存储最大同时到达数。 
2. 将第一个顾客的到达时间存储在`last_time`作为一个元组`(hour, minute)`。 
3. 迭代剩余的`n-1`客户：

 a. 对于每个客户，将到达时间作为元组读取`(hour, minute)`。 

b. 如果这次匹配`last_time`, 增量`current_count`因为另一位顾客同时到达了。 

c. 如果不匹配，则设置`current_count`到 1，因为我们有了新的时间。 

d. 更新`last_time`到当前时间。 

e. 更新`max_count`如果`current_count`超过它。 
4. 迭代完所有客户后，`max_count`是所需现金的最低数量。 打印出来。 

这里的不变量是`current_count`始终反映当前时间到达的顾客数量，并且`max_count`记录了迄今为止所见的最大此类值。 由于时间已排序，因此具有相同时间戳的客户不会在不被计数的情况下出现在稍后的输入中。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
h, m = map(int, input().split())
last_time = (h, m)
current_count = 1
max_count = 1

for _ in range(n - 1):
    h, m = map(int, input().split())
    current_time = (h, m)
    if current_time == last_time:
        current_count += 1
    else:
        current_count = 1
        last_time = current_time
    if current_count > max_count:
        max_count = current_count

print(max_count)
```解决方案读取循环外第一个客户进行初始化`last_time`和`current_count`。 对于每个后续客户，它都会比较时间并更新计数器。 这可以确保在计算第一次出现时不会出现差一错误，并避免不必要的检查。 使用元组`(hour, minute)`保持比较简单明了。 

## 工作示例

 **示例输入 1**```
4
8 0
8 10
8 10
8 45
```| 步骤| 上次 | 当前时间 | 当前计数 | 最大计数 |
 | --- | --- | --- | --- | --- |
 | 初始化| (8,0) | (8,0) | 1 | 1 |
 | 1 | (8,0) | (8,10) | 1 | 1 |
 | 2 | (8,10) | (8,10) | 2 | 2 |
 | 3 | (8,10) | (8,45) | 1 | 2 |

 该表显示最多同时到达 2 个，因此我们需要 2 个现金。 

**示例输入 2**```
3
9 0
9 15
9 30
```| 步骤| 上次 | 当前时间 | 当前计数 | 最大计数 |
 | --- | --- | --- | --- | --- |
 | 初始化| (9,0) | (9,0) | 1 | 1 |
 | 1 | (9,0) | (9,15) | 1 | 1 |
 | 2 | (9,15) | (9,30) | 1 | 1 |

 每个顾客到达的时间不同，所以一张现金就足够了。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 我们对每个客户进行一次迭代，并对每个客户执行恒定时间操作。 |
 | 空间| O(1) | O(1) | 我们只存储一些计数器和元组； 不需要额外的数组或映射。 |

 给定`n ≤ 100,000`和线性迭代，该解决方案在 2 秒的时间限制内执行良好，与 256 MB 的限制相比，内存使用量可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    h, m = map(int, input().split())
    last_time = (h, m)
    current_count = 1
    max_count = 1
    for _ in range(n - 1):
        h, m = map(int, input().split())
        current_time = (h, m)
        if current_time == last_time:
            current_count += 1
        else:
            current_count = 1
            last_time = current_time
        if current_count > max_count:
            max_count = current_count
    return str(max_count)

# provided samples
assert run("4\n8 0\n8 10\n8 10\n8 45\n") == "2", "sample 1"
assert run("3\n9 0\n9 15\n9 30\n") == "1", "sample 2"

# custom cases
assert run("1\n0 0\n") == "1", "single customer"
assert run("5\n10 0\n10 0\n10 0\n10 0\n10 0\n") == "5", "all same time"
assert run("6\n1 1\n1 2\n1 2\n1 2\n1 3\n1 4\n") == "3", "three at same minute"
assert run("4\n23 59\n23 59\n0 0\n0 0\n") == "2", "boundary wrap-around"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 位客户 | 1 | 最小输入尺寸 |
 | 全部同时| 5 | 最大同时到达人数 |
 | 混合重复| 3 | 具有重复项的多个组 |
 | 边界包裹| 2 | 一天结束和开始的时间，确保不会跨日计数 |

 ## 边缘情况

 对于单个客户，输入`1\n12 30\n`,`current_count`和`max_count`被初始化为 1 并且循环不运行，产生 1，这是正确的。 对于同时到达的所有顾客，计数器通过循环正确递增，产生正确的最大值。 当到达时间是一天结束时和下一天到达时间是午夜时，比较`(hour, minute)`确保跨天没有错误聚合。 这种具体的处理可以防止任何一对一错误或跨界错误。
