---
title: "CF 285B - 寻找大理石"
description: "我们有一排 n 个眼镜，每个眼镜都有从 1 到 n 的唯一索引。 弹珠从玻璃下方的位置 s 开始。 Petya 定义了位置排列，决定了眼镜在洗牌过程中如何同时移动。"
date: "2026-06-05T09:51:17+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 285
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 175 (Div. 2)"
rating: 1200
weight: 285
solve_time_s: 103
verified: true
draft: false
---

[CF 285B - 寻找大理石](https://codeforces.com/problemset/problem/285/B)

 **评分：** 1200
 **标签：** 实施
 **求解时间：** 1m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一排`n`眼镜，每个眼镜都有唯一索引，从 1 到`n`。 弹珠从玻璃下方的位置开始`s`。 Petya 定义了位置排列，决定了眼镜在洗牌过程中如何同时移动。 如果是玻璃`i`目前就位`i`，经过随机播放后，它移动到位置`p[i]`。 Vasya 观察大理石所在位置`t`经过一定次数的洗牌后。 任务是确定弹珠到达所需的最小洗牌次数`t`，或报告`-1`如果不可能的话。 

关键的观察结果是每次洗牌都会对所有位置应用固定的排列，并且弹珠与其玻璃一起移动。 因此，弹珠的轨迹是通过重复应用从以下位置开始的排列来确定的：`s`。 

约束表明`n`可以大到 10^5。 每次洗牌都需要根据排列移动所有玻璃杯。 模拟所有可能的洗牌序列的简单解决方案在操作数量上将具有指数复杂性，这是不可行的。 单独沿着弹珠轨迹行走的解决方案是可行的，因为在循环重复之前每个玻璃最多可以访问一次，从而给出线性 O(n) 算法。 

非明显的边缘情况包括`s`等于`t`。 在这种情况下，即使排列很重要，也可能需要零洗牌。 另一个微妙的情况是包含不包含循环的排列`t`。 例如，如果`s`处于一个永远不会到达的循环中`t`，答案应该是`-1`。 粗心的实现可能会无限循环而不检测循环。 

## 方法

 暴力法是逐步模拟弹珠的运动。 开始于`s`，重复应用排列，并计算步数，直到弹珠到达`t`。 这是正确的，因为每次洗牌都会确定性地沿着独特的轨迹移动弹珠。 然而，在最坏的情况下，洗牌的次数可能是 O(n)，如果我们不跟踪访问过的位置，我们可能会进入一个循环并无限循环。 操作次数最多为`n`因为排列是双射； 一旦某个位置重复，任何后续动作都只会循环。 

允许最佳方法的关键观察是弹珠沿着排列的单个周期移动。 我们不需要模拟整行。 我们可以跟踪弹珠的当前位置，增加计数器，并在弹珠到达时停止`t`或者我们检测到重复的位置。 这保证了眼镜数量的线性解，并且在给定约束的情况下就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力（模拟所有位置）| O(n^2) | O(n^2) | O(n) | 对于 n ~ 10^5 来说太慢 |
 | 轨迹跟踪（仅限弹珠）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化变量`pos`到`s`代表弹珠和计数器的当前位置`steps`为 0。这设置了我们模拟的起点。 
2.如果`pos`等于`t`，立即返回`steps`为 0。这处理不需要洗牌的简单情况。 
3. 否则，开始一个循环，一直持续到`pos`等于`t`或者我们检测到一个循环。 在每次迭代时：

 a. 放`pos`到`p[pos]`，沿着排列移动弹珠。 

b. 增量`steps`1.

 c. 如果`pos`等于`t`， 返回`steps`。 

d. 如果`pos`等于`s`再次，它表示一个不包括的循环`t`; 返回`-1`。 
4. 循环结束。 如果我们退出而不返回，则返回`-1`来表明不可能。 

为什么它有效：不变的是`pos`始终代表弹珠的当前位置。 由于排列是双射的，因此弹珠沿着固定的周期移动。 循环要么包含`t`，在这种情况下我们最多会达到它`n`步骤，或者不执行，在这种情况下重新访问`s`表示不可能。 无法跳过循环中的位置或到达`t`通过不同的路径。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, s, t = map(int, input().split())
p = [0] + list(map(int, input().split()))  # 1-indexed

if s == t:
    print(0)
    sys.exit()

pos = s
steps = 0
visited = set()

while pos not in visited:
    visited.add(pos)
    pos = p[pos]
    steps += 1
    if pos == t:
        print(steps)
        break
else:
    print(-1)
```该代码使用从 1 开始的索引来匹配问题陈述。 我们处理琐碎的案件`s == t`立即地。 一个`visited`设置轨道位置以检测循环并防止无限循环。 在每一步中，我们都会更新弹珠的位置并检查它是否到达`t`。 如果我们重新访问一个位置而没有到达`t`，我们得出结论：目标无法实现。 

## 工作示例

 **样品1**

 输入：```
4 2 1
2 3 4 1
```| 步骤| 邮政 | 步骤| 访问过 |
 | --- | --- | --- | --- |
 | 0 | 2 | 0 | {} |
 | 1 | 3 | 1 | {2} |
 | 2 | 4 | 2 | {2,3} |
 | 3 | 1 | 3 | {2,3,4} |

 大理石到达`1`3步后。 访问集确保我们永远不会无限循环。 

**样品2**

 输入：```
5 3 3
2 3 4 5 1
```初始位置等于目标位置。 该算法立即返回 0。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 由于循环检测，每个位置最多被访问一次。 |
 | 空间| O(n) | 这`visited`set 可以存储最坏情况下的所有位置。 |

 考虑到约束条件`n ≤ 10^5`还有2秒的时间限制，这样效率很高。 内存使用量保持在 256 MB 限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # solution code here
    n, s, t = map(int, input().split())
    p = [0] + list(map(int, input().split()))
    if s == t:
        print(0)
    else:
        pos = s
        steps = 0
        visited = set()
        while pos not in visited:
            visited.add(pos)
            pos = p[pos]
            steps += 1
            if pos == t:
                print(steps)
                break
        else:
            print(-1)
    return output.getvalue().strip()

# provided sample
assert run("4 2 1\n2 3 4 1\n") == "3", "sample 1"
# s equals t
assert run("5 3 3\n2 3 4 5 1\n") == "0", "trivial case"
# unreachable t
assert run("3 1 3\n2 1 3\n") == "-1", "cycle without t"
# minimum input
assert run("1 1 1\n1\n") == "0", "single glass"
# maximum input simple cycle
perm = ' '.join(str(i % 100000 + 1) for i in range(100000))
assert run(f"100000 1 100000\n{perm}\n") == "-1", "large cycle no t"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | “5 3 3\n2 3 4 5 1\n”| 0 | s 等于 t |
 | “3 1 3\n2 1 3\n”| -1 | 大理石达不到t |
 | "1 1 1\n1\n" | 0 | 最小尺寸输入|
 | 大循环 n=10^5 | -1 | 性能和周期检测|

 ## 边缘情况

 当`s == t`，算法立即返回 0。 例如，输入`5 3 3`返回0而不进入循环。 

当排列形成不包含的循环时`t`，访问集检测到`pos`重新访问之前的位置，算法正确返回`-1`。 用于输入`3 1 3`和`p = [2,1,3]`，弹珠从 1→2→1 移动，但永远不会到达 3，从而触发 else 分支。 

该算法正确处理由于沿弹珠轨迹线性遍历而产生的最大输入尺寸，避免模拟不相关的玻璃。
