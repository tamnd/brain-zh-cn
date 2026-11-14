---
title: "CF 44C - 假期"
description: "我们被要求验证一系列连续假期的花卉浇水时间表。 每天必须浇水一次。 该时间表为每个人指定了他们被分配给花浇水的天数范围。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 44
codeforces_index: "C"
codeforces_contest_name: "School Team Contest 2 (Winter Computer School 2010/11)"
rating: 1300
weight: 44
solve_time_s: 84
verified: true
draft: false
---

[CF 44C - 假期](https://codeforces.com/problemset/problem/44/C)

 **评分：** 1300
 **标签：** 实施
 **求解时间：** 1m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求验证一系列连续假期的花卉浇水时间表。 每天必须浇水一次。 该时间表为每个人指定了他们被分配给花浇水的天数范围。 目标是检测是否存在任何错误：要么是没有人浇花的一天，要么是多人浇花的一天。 如果有错误，我们必须报告最早的一天以及不正确的浇水次数以及当天浇花的次数。 否则，我们只是报告“OK”。 

输入由两个整数_n_和_m_组成，分别代表天数和人数。 然后遵循 _m_ 对整数，指示每个人浇水任务的开始和结束日期。 每个分配范围都在总天数之内。 约束很小：_n_ 和 _m_ 都最多为 100。这允许时间复杂度高达 O(n·m) 的算法在时间限制内高效运行。 

一个幼稚的实现可能只是简单地单独检查每一天并计算有多少作业涵盖了这一天。 当两个人具有连续或重叠的范围时，就会出现微妙的边缘情况。 例如，如果两个人被分配为 [2, 4] 和 [4, 6]，则第 4 天将被覆盖两次。 另一个边缘情况是日程安排中存在间隙，例如作业 [1, 2] 和 [4, 5]，导致第 3 天没有浇水。 仅查看开始或结束日期的粗心解决方案可能会错过这些问题。 

## 方法

 蛮力方法很简单：从 1 到 _n_ 的每一天，通过迭代所有 _m_ 个人来计算有多少作业覆盖了这一天。 这是可行的，因为我们每天都会检查 _m_ 个时间间隔，从而导致 O(n·m) 次操作。 当n和m达到100时，最多10,000次操作，这是可以接受的。 缺点是概念性的：我们重复检查重叠，如果我们直接跟踪浇水计数，则没有必要。 

更有效的方法是使用大小为 _n_ 的数组（初始化为零）来存储每天的浇水次数。 对于每个分配范围 [a_i, b_i]，我们增加该范围内的所有天数。 处理完所有分配后，我们扫描数组以查找值不为 1 的任何一天。这保证了正确性，因为我们明确计算每天的浇水次数并允许立即识别错误。 考虑到限制，效率还算可以接受，而且比每天单独重复检查实现起来更简单、更不易出错。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n·m) | O(1) | O(1) | 已接受 |
 | 范围计数数组 | O(n·m) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个数组`watered`长度 _n_ 用零填充。 每个元素代表当天浇水的次数。 这明确地模拟了关键不变量：`watered[i]`等于第 i+1 天的作业数量。 
2. 迭代每个人的任务。 对于每个范围 [a_i, b_i]，增量`watered[j]`对于从 a_i-1 到 b_i-1（含）的所有 j。 减去 1 的原因是为了将输入中从 1 开始的天数转换为 Python 中从 0 开始的数组索引。 
3. 处理完所有赋值后，迭代`watered`从第一天到最后一天。 每天检查该值是否正好为 1。如果是，则继续。 如果不是，这一天就是第一个错误的日子。 打印天数（索引+1）和值`watered`在那一天，然后终止。 这可以确保我们报告浇水次数不正确的最短日期。 
4. 如果循环完成后没有发现任何不正确的日期，则打印“OK”。 

该算法之所以有效，是因为我们保持了一个不变量：在步骤 2 结束时，`watered[i]`精确计算第 i+1 天计划浇水的次数。 第 3 步保证我们检测到第一个违反每天浇水一次规则的行为。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
watered = [0] * n

for _ in range(m):
    a, b = map(int, input().split())
    for day in range(a - 1, b):
        watered[day] += 1

for i in range(n):
    if watered[i] != 1:
        print(i + 1, watered[i])
        break
else:
    print("OK")
```数组`watered`models the exact number of waterings per day. 我们小心地将基于 1 的输入索引转换为基于 0 的 Python 数组索引，以避免差一错误。 循环结束`i`确保发现错误的最少天数。 使用`else`on 循环确保如果不存在错误，则打印“OK”。 

## 工作示例

 **样品1：**

 输入：```
10 5
1 2
3 3
4 6
7 7
8 10
```| 日 | 浇水|
 | ---| ---|
 | 1 | 1 |
 | 2 | 1 |
 | 3 | 1 |
 | 4 | 1 |
 | 5 | 1 |
 | 6 | 1 |
 | 7 | 1 |
 | 8 | 1 |
 | 9 | 1 |
 | 10 | 10 1 |

 所有日子都浇水一次，因此输出是“OK”。 

**样本2：**

 输入：```
5 2
1 2
4 5
```| 日 | 浇水|
 | ---| ---|
 | 1 | 1 |
 | 2 | 1 |
 | 3 | 0 |
 | 4 | 1 |
 | 5 | 1 |

 第3天没有浇水，所以第3天出现第一个错误，输出“3 0”。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n·m) | 对于 m 个人中的每一个人，我们在他们的范围内增加最多 n 天。 当 n、m ≤ 100 时，总操作数 ≤ 10,000。 |
 | 空间| O(n) | 数组`watered`长度为 n 的存储每天的计数。 |

 考虑到这些限制，该解决方案可以轻松地在 2 秒的时间限制内运行，并且使用最少的内存。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    n, m = map(int, input().split())
    watered = [0] * n
    for _ in range(m):
        a, b = map(int, input().split())
        for day in range(a - 1, b):
            watered[day] += 1
    for i in range(n):
        if watered[i] != 1:
            print(i + 1, watered[i])
            break
    else:
        print("OK")
    return output.getvalue().strip()

# provided samples
assert run("10 5\n1 2\n3 3\n4 6\n7 7\n8 10\n") == "OK", "sample 1"
assert run("5 2\n1 2\n4 5\n") == "3 0", "sample 2"

# custom cases
assert run("1 1\n1 1\n") == "OK", "single day watered correctly"
assert run("2 1\n1 2\n") == "OK", "two days watered by one person"
assert run("3 2\n1 2\n2 3\n") == "2 2", "overlapping day"
assert run("4 1\n2 3\n") == "1 0", "first day not watered"
assert run("5 3\n1 1\n3 3\n5 5\n") == "2 0", "middle day not watered"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1\n1 1 | 1 1\n1 1 | 好的 | 最小输入大小有效 |
 | 2 1\n1 2 | 好的 | 单人多日 |
 | 3 2\n1 2\n2 3 | 2 2 | 2 检测重叠日 |
 | 4 1\n2 3 | 1 1 0 | 1 0 第一天没浇水|
 | 5 3\n1 1\n3 3\n5 5 | 3\n1 1\n3 3\n5 5 2 0 | 2 检测中间未浇水的日子|

 ## 边缘情况

 处理重叠分配的情况，例如 [1, 2] 和 [2, 3]，因为数组会递增所有涵盖日期的计数。 第2天将会有`watered[1] = 2`，算法正确输出“2 2”。 如果分配中缺少第一天，例如分配 [2, 3]，则第 1 天仍为 0，并且算法输出“1 0”。 在所有情况下，阵列都会准确地计算浇水量并确保最早报告错误。
