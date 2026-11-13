---
title: "CF 245A - 系统管理员"
description: "Polycarpus 正在为两台服务器运行一个简单的监控例程，我们可以将其称为服务器 a 和服务器 b。 每个“ping”命令正好向其中一台服务器发送十个数据包。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 245
codeforces_index: "A"
codeforces_contest_name: "CROC-MBTU 2012, Elimination Round (ACM-ICPC)"
rating: 800
weight: 245
solve_time_s: 207
verified: true
draft: false
---

[CF 245A - 系统管理员](https://codeforces.com/problemset/problem/245/A)

 **评分：** 800
 **标签：** 实施
 **求解时间：** 3m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Polycarpus 正在为两台服务器运行一个简单的监控例程，我们可以将其称为服务器 _a_ 和服务器 _b_。 每个“ping”命令正好向其中一台服务器发送十个数据包。 输入告诉我们，对于每个 ping，有多少数据包成功到达服务器以及有多少数据包丢失。 目标是在一天结束时确定每个服务器是“活着”还是“死了”。 如果一天中发送到服务器的所有数据包中至少有一半成功到达服务器，则该服务器“处于活动状态”； 否则，它就“死了”。 

输入给出了执行的 ping 命令的数量，后跟每个命令的结果列表。 每行指示对哪台服务器进行 ping 操作以及成功和失败的数据包数。 因为ping命令的数量最多为1000条，所以我们可以线性处理所有命令。 每个 ping 仅涉及简单的算术（对成功的数据包求和），因此我们不需要高级的数据结构或算法。 

当成功数据包的总数恰好是发送的所有数据包的一半时，就会出现微妙的边缘情况。 例如，如果服务器 _a_ 收到两个 ping，每个 5 个成功数据包，则总数为 20 个中的 10 个，符合“活动”条件。 粗心的实现可能会检查严格大于一半的情况，从而产生错误的“死”答案。 另一种需要注意的情况是，当一台服务器接收到的 ping 远多于另一台服务器时，这不应影响每台服务器的独立计算。 

## 方法

 简单的方法在这里实际上是最佳的。 原则上，我们可以单独模拟每个数据包，但由于每个 ping 总是发送十个数据包，因此跟踪每个服务器的成功数据包总数和发送数据包总数就足够了。 这相当于累计成功次数并与发送的总数据包的一半进行比较。 列出每个单独数据包的强力方法将需要 O(n*10) 操作，这对于 n = 1000 仍然可行，但没有必要。 

关键的见解是，除了计算成功次数之外，我们并不关心单个 ping。 我们需要的是两个累加器，每个服务器一个，对成功进行求和，然后将每个累加器与发送到该服务器的总数据包的一半进行比较。 这将问题简化为 O(n) 时间和 O(1) 空间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（模拟数据包）| O(n*10) | O(n*10) | 已接受但矫枉过正|
 | 最佳（成功总和）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 为成功数据包初始化两个计数器：`success_a`和`success_b`，以及发送的数据包总数的两个计数器：`total_a`和`total_b`。 每个服务器以零成功和零发送数据包启动。 
2. 迭代所有 ping 命令。 对于每个命令，读取服务器类型`t`, 成功次数`x`，以及丢失数据包的数量`y`。 
3.如果`t`为 1（服务器_a_），添加`x`到`success_a`并添加`x + y`（始终为 10）`total_a`。 如果`t`为 2（服务器_b_），添加`x`到`success_b`并添加`x + y`到`total_b`。 这会累积为每个服务器发送的总成功数和总数据包数。 
4.处理完所有命令后，进行比较`success_a`和`total_a // 2`。 如果大于或等于一半`total_a`，服务器 _a_ 处于“LIVE”状态； 否则，它就是“DEAD”。 使用以下命令对服务器 _b_ 执行相同操作`success_b`和`total_b // 2`。 

工作原理：根据发送的数据包总数和成功总数对每个服务器进行独立评估。 对成功次数和总数进行求和可以保持检查至少一半数据包是否成功所需的精确比率。 累积总数而不是跟踪单个 ping 不会丢失任何信息。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
success_a = 0
success_b = 0
total_a = 0
total_b = 0

for _ in range(n):
    t, x, y = map(int, input().split())
    if t == 1:
        success_a += x
        total_a += x + y
    else:
        success_b += x
        total_b += x + y

print("LIVE" if success_a * 2 >= total_a else "DEAD")
print("LIVE" if success_b * 2 >= total_b else "DEAD")
```该解决方案初始化每个服务器的计数器并迭代每个 ping 命令。 比较中乘以2避免了浮点除法，并正确处理成功数据包数量正好是总数一半的情况。 该代码确保每个 ping 都被考虑在内，并且决策逻辑与问题需求相匹配。 

## 工作示例

 样本1：

 | t | x| y | 成功_a | 总计_a | 成功_b | 总计_b |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 5 | 5 | 5 | 10 | 10 0 | 0 |
 | 2 | 6 | 4 | 5 | 10 | 10 6 | 10 | 10

 处理后，success_a_2 = 10 >=total_a=10→LIVE，success_b_2 = 12 >=total_b=10→LIVE。 两台服务器都处于活动状态。 

样本2：

 | t | x| y | 成功_a | 总计_a | 成功_b | 总计_b |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 10 | 10 10 | 10 10 | 10 20 | 0 | 0 |
 | 2 | 0 | 10 | 10 10 | 10 20 | 0 | 10 | 10

 success_a_2 = 20 >= Total_a=20 → 存活，success_b_2 = 0 < Total_b=10 → 死亡。 服务器 A 还活着，服务器 B 死了。 

该跟踪表明该算法正确处理了精确的一半成功和零成功情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | n 个命令中的每一个都只处理一次，每个命令执行恒定的工作。 |
 | 空间| O(1) | O(1) | 无论 n 是多少，都只维护四个计数器。 |

 由于 n ≤ 1000，O(n) 解决方案很容易满足 2 秒的时间限制。 内存使用量可以忽略不计，远低于 256 MB 限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    success_a = 0
    success_b = 0
    total_a = 0
    total_b = 0
    for _ in range(n):
        t, x, y = map(int, input().split())
        if t == 1:
            success_a += x
            total_a += x + y
        else:
            success_b += x
            total_b += x + y
    return f"{'LIVE' if success_a*2 >= total_a else 'DEAD'}\n{'LIVE' if success_b*2 >= total_b else 'DEAD'}"

# Provided samples
assert run("2\n1 5 5\n2 6 4\n") == "LIVE\nLIVE", "sample 1"
assert run("2\n1 10 10\n2 0 10\n") == "LIVE\nDEAD", "sample 2"

# Custom cases
assert run("2\n1 5 5\n2 5 5\n") == "LIVE\nLIVE", "half-success boundary"
assert run("2\n1 4 6\n2 5 5\n") == "DEAD\nLIVE", "a fails, b passes"
assert run("4\n1 10 0\n1 0 10\n2 5 5\n2 0 10\n") == "LIVE\nDEAD", "multiple pings with mixed results"
assert run("2\n1 0 10\n2 0 10\n") == "DEAD\nDEAD", "all failures"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2\n1 5 5\n2 5 5 | 2\n1 5 5\n2 5 5 直播\n直播| 成功案例正好一半|
 | 2\n1 4 6\n2 5 5 | 死\n活 | 一台服务器失败，一台服务器通过 |
 | 4\n1 10 0\n1 0 10\n2 5 5\n2 0 10 | 4\n1 10 0\n1 0 10\n2 5 5\n2 0 10 生\n死 | 多次 ping 成功与否 |
 | 2\n1 0 10\n2 0 10 | 2\n1 0 10\n2 0 10 死了\n死了 | 零成功案例|

 ## 边缘情况

 对于半成功边界，输入`2\n1 5 5\n2 5 5\n`结果`success_a=5, total_a=10`和`success_b=5, total_b=10`。 条件`success*2 >= total`评估为`10 >= 10`→ 是的，所以两个服务器都处于活动状态。 这证实了该算法正确处理了 50% 的成功率。 

对于全部失败的情况`2\n1 0 10\n2 0 10`，计数器`success_a=0，total_a=10
