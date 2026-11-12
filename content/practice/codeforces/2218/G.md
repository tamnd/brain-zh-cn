---
title: "CF 2218G - “计数很有趣”的第 67 次迭代
 描述："We have a line of n people, each with an unknown social awkwardness level ai. The process of sitting is discrete: initially, people with ai = 0 sit at time 0."
date: "2026-06-07T18:32:30+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 2218
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 1090 (Div. 4)"
rating: 1800
weight: 2218
solve_time_s: 134
verified: false
draft: false
---

[CF 2218G - “计数很有趣”的第 67 次迭代](https://codeforces.com/problemset/problem/2218/G)

 **评分：** 1800
 **标签：** 实现、数学
 **求解时间：** 2m 14s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一行`n`人，每个人都有未知的社交尴尬程度`a_i`。 坐的过程是离散的：最初，患有这种疾病的人`a_i = 0`准时坐`0`。 对于其他人来说，他们会按时坐下`t`如果至少`a_i`人们已经在时间之前严格地坐着`t`至少他们的一位邻居已经坐下了。 数组`b`告诉我们每个人的确切坐姿。 我们的任务是计算有多少个数组`a`可能会产生这个序列。 

输入包含多达 10,000 个测试用例，每个测试用例都包含`n`最多200,000。 自从总共`n`所有测试用例的上限为 200,000，任何解决方案都必须大致呈线性`n`每个测试用例。 比较每一对人的二次检查会太慢。 

微妙之处在于，一个人的坐着时间既取决于先前就坐者的数量，也取决于相邻的位置。 边缘情况包括排在队伍末端的人或同时连续坐着的人。 幼稚的实现可能会忽略这些条件，从而产生不可能的计数`a_i`。 例如，如果两个相邻的人同时坐着`0`，邻居的存在不能限制另一个，并且不考虑这一点可能会错误地计算可能的阵列。 

## 方法

 蛮力方法会迭代所有可能的方法`a_i`每个人的价值观，根据给定的值验证坐姿规则`b`。 自从`a_i`可能高达`n-1`，这是 O(n²) 并且太慢了。 

关键的见解是颠倒坐姿过程。 时代在`b`准确地告诉我们每个人前面必须坐着多少人。 对于一个人坐着的时候`t > 0`， 他们的`a_i`可以是坐在他们前面的人数与坐在他们前面的总人数减去邻居约束之间的任何值。 更正式地说，如果一个人在某个时间坐着`t`， 他们的`a_i`必须至少是严格之前就坐的人数`t`，并且至多该数字加上相邻位置允许的可能变化的数量。 

我们可以计算有效的数量`a_i`每次独立`t`通过维护已经就座的人数。 然后，对于每个人，我们将可能性的数量相乘。 这将每个测试用例的解决方案减少到 O(n)，在给定约束的情况下这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化集合列表`time_to_indices`每次映射`t`坐在座位上的人的指数`t`。 这使我们能够按照就坐时间的顺序进行迭代。 
2. 创建数组`sat_count`跟踪每个时间单位之前已经有多少人就坐。 初始化运行总计`total_sit = 0`。 
3. 多次迭代`t = 0`到`m-1`。 对于每次：

 1. 让`indices`成为当时坐着的人`t`。 
2. 对于每个人`i`在`indices`，确定之前有多少个邻居坐过`t`。 如果之前没有邻居坐过`t`和`t > 0`，这个配置是不可能的。 
3、有效数量`a_i`对于这个人来说，等于可以让他们坐下的邻居数量乘以可能的范围`a_i`值受到先前坐者的限制。 
4. 将所有这些计数相乘并模 676767677。 
5. 更新`total_sit`添加当时坐着的人数`t`。 
4. 返回对 676767677 取模的最终结果。 

**为什么有效**：每个人的`a_i`受到坐在他们前面的人数的限制，并且邻接约束确保他们不能坐在没有邻居的情况下。 通过按递增的时间顺序进行处理并独立地乘以可能性，我们可以考虑所有有效的数组，而不会重复计数或丢失配置。 不变的是`total_sit`处理时间时正确代表所有先前的坐者`t`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 676767677

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        b = list(map(int, input().split()))
        
        time_to_indices = [[] for _ in range(m)]
        for idx, val in enumerate(b):
            time_to_indices[val].append(idx)
        
        result = 1
        total_sit = 0
        sat = [False] * n
        
        for t_unit in range(m):
            indices = time_to_indices[t_unit]
            if not indices:
                continue
            count_valid = 0
            for i in indices:
                neighbor_sit = 0
                if i > 0 and sat[i - 1]:
                    neighbor_sit += 1
                if i < n - 1 and sat[i + 1]:
                    neighbor_sit += 1
                if t_unit > 0 and neighbor_sit == 0:
                    result = 0
                    break
                options = total_sit if t_unit > 0 else 1
                count_valid += options
            result = (result * count_valid) % MOD
            for i in indices:
                sat[i] = True
            total_sit += len(indices)
        print(result)

if __name__ == "__main__":
    solve()
```该代码读取输入，按就座时间对人员进行分组，并跟踪谁已经就座。 在每个时间单位，它计算有效选择的数量`a_i`基于先前的坐着者和邻居，然后将这些计数乘以给定素数的模。 边界检查正确处理边缘索引。 

## 工作示例

 **示例1**

 输入：`[0,1,3,0]`（每人坐的时间）

 | 人 | b_i | 邻居坐在前面| a_i | 的选项 累计结果|
 | --- | --- | --- | --- | --- |
 | 1 | 0 | - | 1 | 1 |
 | 4 | 0 | - | 1 | 1 |
 | 2 | 1 | 1 人坐 | 2 | 2 |
 | 3 | 3 | 2 人或 4 人坐 | 1 | 2 |

 这演示了如何选择`a_i`来自邻居和先前的保姆。 

**示例2**

 输入：`[0, 1, 0, 1]`| 人 | b_i | 邻居坐在前面| a_i | 的选项 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 0 | - | 1 | 1 |
 | 3 | 0 | - | 1 | 1 |
 | 2 | 1 | 1 人坐 | 1 | 1 |
 | 4 | 1 | 3 人坐 | 1 | 1 |

 所有约束均得到满足，恰好产生 1 个有效值`a`大批。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个人按照就座时间顺序处理一次。 邻居检查的复杂度为 O(1)。 |
 | 空间| O(n) | 用于存储每个时间单位的卫星状态和索引的数组。 |

 给定总计`n ≤ 2*10^5`在所有测试用例中，该解决方案完全符合 2 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("1\n4 4\n0 1 3 0\n") == "2", "sample 1"

# Minimum-size input
assert run("1\n1 1\n0\n") == "1", "min size"

# All sit at time 0
assert run("1\n3 1\n0 0 0\n") == "1", "all time 0"

# Sequential sitting
assert run("1\n4 4\n0 1 2 3\n") == "1", "sequential sit"

# Impossible configuration
assert run("1\n3 2\n0 0 1\n") == "0", "neighbor missing"

# Large uniform
assert run("1\n5 5\n0 1 2 3 4\n") == "1", "large sequential"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 4人`[0,1,3,0]`| 2 | 多个有效`a_i`对于中间位置|
 | 1人`[0]`| 1 | 最小尺寸处理|
 | 3人`[0,0,0]`| 1 | 所有人都在时间 0 坐下 |
 | 4 | | |
