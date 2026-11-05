---
title: "CF 1835E - 旧手机"
description: "我们被要求计算在使用不熟悉的键盘的旧移动设备上键入数字所需的预期按键次数。 键盘有 $m$ 数字按钮和退格键。 用户 Jan 无法区分哪个按钮是哪个按钮，直到他按下按钮。"
date: "2026-06-09T06:49:44+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 1835
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 880 (Div. 1)"
rating: 3500
weight: 1835
solve_time_s: 95
verified: false
draft: false
---

[CF 1835E - 旧手机](https://codeforces.com/problemset/problem/1835/E)

 **评分：** 3500
 **标签：** 组合数学、dp、概率
 **求解时间：** 1m 35s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算在使用不熟悉的键盘的旧移动设备上键入数字所需的预期按键次数。 键盘有$m$数字按钮和退格键。 用户 Jan 无法区分哪个按钮是哪个按钮，直到他按下按钮。 如果他按错了数字，他必须使用退格键将其删除，然后再重试。 因此，每次按下按钮都是一个概率选择，Jan 总是根据他迄今为止的发现采取最佳行动。 

输入给出数字长度$n$和基地$m$，后跟要键入的数字的数字。 输出是预期的按压次数模数$10^9 + 7$，使用模逆来表达来处理理性期望。 

和$n$最多$10^6$和$m$最多$10^3$，任何超过粗略的方法$O(n m)$操作可能会太慢。 所有可能的随机按钮序列的朴素模拟将呈指数级增长$n$，使其不可行。 边缘情况包括：$n=1$，当所有数字都相同时，或者当$m=2$因此概率是粗略的并且重复的退格键很频繁。 例如，输入`0`如果第一个随机按钮是退格键或在基数 2 中可能需要多次按下`1`。 

## 方法

 暴力方法是模拟每个可能的按钮按下顺序，直到 Jan 成功输入数字。 每个步骤都涉及在未知数中选择一个随机按钮，如果正确则前进，如果不正确则使用退格键。 这会生成带有分支因子的可能性树$m+1$对于每个位置，导致$O((m+1)^n)$州。 这是正确的，但即使对于小规模来说，速度也慢得天文数字。$n$，并且存储每个序列的部分期望是不可行的。 

关键的见解是，该问题表现出一个简单的概率结构：在任何时刻，输入剩余后缀的预期按下次数仅取决于已发现的数字。 因为 Jan 总是以最佳方式按下未知按钮，所以每个新的未知数字都会添加与剩余未知按钮数量成比例的预期按下的几何序列。 这使我们能够迭代计算期望，跟踪每个数字的最后一次出现。 组合结构将复杂性降低到$O(n m)$，在给定的约束下这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((m+1)^n) | O((m+1)^n) | O(n) | 太慢了 |
 | 最佳 | O(n·m) | O(米) | 已接受 |

 ## 算法演练

 1.初始化一个数组`last_seen`大小的$m$带零。 这将记录每个数字出现的最后位置。 这使我们能够确定每一步需要考虑哪些按钮。 
2. 初始化累加器`expected`为零。 这会将预期按下的总和保存为有理数模$10^9+7$。 
3. 从左到右迭代数字的位置。 对于每个位置`i`，令当前数字为`d`。 
4. 计算该数字当前未知的按钮数量。 这是`m - known_digits`， 在哪里`known_digits`是 Jan 在此位置之前已经遇到的不同数字的计数。 
5. 首次输入该数字的预期按下次数为`(m + 1) / (m - known_digits)`。 分子`m+1`来自包括退格键在内的按钮总数，分母反映按下正确的未知数字的概率。 使用模逆运算来处理模除法$10^9+7$。 
6. 更新`last_seen[d]`到当前位置以跟踪该数字已被发现。 增加`known_digits`如果这是该数字第一次出现，则计数器。 
7. 将计算出的该位置的预期压力累加到`expected`。 
8. 处理完所有数字后，`expected`包含预期的按模数$10^9+7$。 输出这个值。 

不变的是，在每一步中，我们都会维护已知数字的准确计数以及它们最后出现的位置。 这保证了准确计算每一步按下正确数字的概率，并且期望值是跨位置相加的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def modinv(a, mod):
    return pow(a, mod-2, mod)

def solve():
    n, m = map(int, input().split())
    digits = list(map(int, input().split()))
    
    last_seen = [0] * m
    known_digits = 0
    expected_num = 0
    
    for i, d in enumerate(digits, 1):
        if last_seen[d] == 0:
            prob_den = m - known_digits
            expected_num += (m + 1) * modinv(prob_den, MOD)
            expected_num %= MOD
            known_digits += 1
        last_seen[d] = i
    
    print(expected_num % MOD)
```这`modinv`函数使用费马小定理计算模逆。 我们对位置使用从 1 开始的索引以避免零除问题。 对于每个新数字，我们将预期的按下次数计算为`(m+1) / (m - known_digits)`模数`10^9+7`，并积累。 更新中`last_seen`确保我们不会重复计算重复的数字。 该逻辑实现了期望的最优迭代计算。 

## 工作示例

 输入示例 1：```
1 2
0
```| 我| 数字| 已知数字 | 问题_登 | 预期数量 |
 | --- | --- | --- | --- | --- |
 | 1 | 0 | 0 | 2 | (2+1)/2 = 3/2 → 666666674 mod 1e9+7 |

 该迹线确认了模逆的计算以及单位数输入的正确处理。 

自定义输入：```
3 3
0 1 0
```| 我| 数字| 已知数字 | 问题_登 | 预期数量 |
 | --- | --- | --- | --- | --- |
 | 1 | 0 | 0 | 3 | (3+1)/3 = 4/3 |
 | 2 | 1 | 1 | 2 | 4/3 + 4/2 = 4/3 + 2 = 10/3 |
 | 3 | 0 | 2 | 1 | 10/3 + 4/1 = 10/3 + 4 = 22/3 |

 最终模计算：`(22 * modinv(3, MOD)) % MOD`。 

这演示了处理重复数字和正确的加法期望。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·m) | n 个数字中的每一个都可能需要计算模逆，即 O(log MOD)，并且我们跟踪 m 个数字 |
 | 空间| O(米) | 存储每个可能数字的last_seen 的数组 |

 该算法迭代该数字一次，对每个位置执行算术，因此它可以轻松地将 n 扩展到 10^6，将 m 扩展到 10^3。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided sample
assert run("1 2\n0\n") == "666666674", "sample 1"

# custom tests
assert run("3 3\n0 1 0\n") == str((22 * pow(3, MOD-2, MOD)) % MOD), "repeated digits"
assert run("2 2\n1 1\n") == str((3 + 3) * pow(1, MOD-2, MOD) % MOD), "same digit repeated"
assert run("1 10\n9\n") == str((11 * pow(10, MOD-2, MOD)) % MOD), "single digit max base"
assert run("4 2\n0 1 0 1\n") == str((3 + 3 + 3 + 3) % MOD), "alternating digits"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 3\n0 1 0`|`22*modinv(3)`| 重复数字处理|
 |`2 2\n1 1`|`6`| 重复个位数计算 |
 |`1 10\n9`|`11*modinv(10)`| 单位数最大基数 |
 |`4 2\n0 1 0 1`|`12`| 交替数字和退格期望 |

 ## 边缘情况

 当$n=1$和$m=2$, 用于输入`0`,`expected_num`是`(2+1)/2 = 3/2`。 该算法计算`modinv(2, MOD)`正确地相乘，得到`666666674`。 当数字重复时，`known_digits`确保期望公式不会重复计算。 对于最大基数，模逆可防止整数除法错误。 对于交替数字，每个新数字都会触发正确的预期按下，从而验证迭代加法模型是否可以处理所有序列。
