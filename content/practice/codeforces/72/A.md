---
title: "CF 72A - Goshtasp、Vishtasp 和 Eidi"
description: "该问题要求我们决定正整数 $n$ 是否可以表示为不同整数的和，其中每个整数要么是 1，要么是素数。 如果存在这样的表示，我们需要产生一个按字典顺序最大的表示。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 72
codeforces_index: "A"
codeforces_contest_name: "Unknown Language Round 2"
rating: 1800
weight: 72
solve_time_s: 78
verified: true
draft: false
---

[CF 72A - Goshtasp、Vishtasp 和 Eidi](https://codeforces.com/problemset/problem/72/A)

 **评分：** 1800
 **标签：** *特殊、贪心、数学
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题要求我们判断一个正整数是否为$n$可以表示为不同整数的和，其中每个整数要么是 1，要么是质数。 如果存在这样的表示，我们需要产生一个按字典顺序最大的表示。 字典序最大意味着，当逐个元素比较序列时，我们更喜欢较大数字出现较早的序列。 

输入是单个整数$n$和$1 \le n \le 10000$。 这个上限足够小，允许算法检查所有素数$n$或执行一些线性时间处理，但它排除了尝试素数所有子集的任何强力方法，因为子集的数量呈指数增长。 

边缘情况是由小数和本身就是素数的数引起的。 例如，$n = 1$应该输出`1=1`。 如果$n$本身是一个素数，字典顺序上最大的解决方案就是单例序列`[n]`。 像 4 这样的数字需要特殊处理，因为`4 = 2 + 2`是不允许的（元素必须不同），因此算法必须考虑类似的组合`1 + 3`。 

主要的微妙之处来自于数字必须不同并且答案必须是字典序上最大的要求。 一个粗心的解决方案可能只是取最小的素数并用 1 填充，但这不能满足字典顺序的要求。 

## 方法

 暴力方法将枚举所有子集`1`和素数直到`n`并检查它们的总和是否等于`n`。 这是正确的，但不可行`n`高达 10000，因为素数子集的数量呈指数增长，很容易超过$2^{1229}$子集（素数数量≤10000）。 

关键的观察是，如果我们想要一个字典顺序最大的序列，我们应该从最大可能的数字开始。 对于任何$n$， 如果$n$是素数，`[n]`自动是最佳序列。 如果不是，我们可以重复选择最大的素数≤剩余和，或者如果没有足够小的素数则选择1，并将其添加到序列中。 这种贪婪方法之所以有效，是因为数字是不同的，并且最大优先方法保证了字典顺序优先。 剩余的总和总是减少，因此该过程终止。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^π(n)) | O(2^π(n)) | O(n) | 太慢了 |
 | 最优贪心 | O(n√n) | O(n√n) | O(n) | 已接受 |

 ## 算法演练

 1. 生成直到$n$使用筛子。 筛子确保我们可以在 O(1) 时间内检查一个数是否为素数。 
2.如果$n$本身是素数，打印`n=n`并终止。 从字典顺序来看，这无疑是最大的。 
3. 否则，初始化一个空列表`answer`并设置`remaining = n`。 
4. 按降序迭代素数。 对于每个素数$p$， 如果$p \le$剩余的，将其附加到`answer`并从中减去它`remaining`。 
5. 如果`remaining > 0`考虑完所有素数后，附加`1`s 根据需要求和至`n`。 这有效是因为`1`可以多次使用，但必须考虑顺序不同。 
6. 以格式打印序列`n=a1+a2+...+am`。 

为什么有效：在每一步中，我们都会选择最大的可用素数，这确保了字典序的极大性。 由于我们只选择 ≤ 剩余的质数，因此我们永远不会超调。 任何剩余量都可以填充`1`s 确保总和准确无误`n`。 该序列仍然是不同的，因为素数自然是不同的，并且`1`是分开处理的。 如果存在的话，这种贪婪方法保证产生有效的表示。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def sieve(limit):
    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(limit**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, limit + 1, i):
                is_prime[j] = False
    primes = [i for i, val in enumerate(is_prime) if val]
    return primes

def main():
    n = int(input())
    primes = sieve(n)
    
    if n in primes or n == 1:
        print(f"{n}={n}")
        return
    
    answer = []
    remaining = n
    for p in reversed(primes):
        if p <= remaining:
            answer.append(p)
            remaining -= p
    answer.extend([1] * remaining)
    result = '+'.join(map(str, answer))
    print(f"{n}={result}")

if __name__ == "__main__":
    main()
```筛子生成所有素数 ≤`n`高效。 我们处理平凡的素数或`1`先说案例。 降序迭代确保我们选择最大的素数来实现字典极大性。 扩展为`1`s 确保我们在剩余金额很小时达到准确的总和。 通过使用可以避免相差一错误`<= remaining`并包括`remaining`最后1秒。 

## 工作示例

 ### 输入：11

 | 剩余| 精选 | 答案列表 |
 | --- | --- | --- |
 | 11 | 11 11 | 11 [11] |
 | 0 | 完成 | [11] |

 ≤ 11 的最大素数就是 11 本身。 剩余变成0，所以我们输出`11=11`。 按字典顺序最大，因为最大的数字最先出现。 

### 输入：8

 | 剩余| 精选 | 答案列表 |
 | --- | --- | --- |
 | 8 | 7 | [7] |
 | 1 | 没有素数 ≤ 1 | [7,1]|

 我们选择 7，留下 1。我们用 a 填充`1`要得到`[7,1]`。 输出`8=7+1`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n√n) | O(n√n) | 筛选的运行时间为 O(n log log n)，降序素数选择的时间为 O(n)。 |
 | 空间| O(n) | 存储筛阵列和答案列表。 |

 给定`n ≤ 10000`，该算法在 5 秒限制和 256 MB 内存限制内运行良好。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# provided sample
assert run("11\n") == "11=11", "sample 1"
# custom cases
assert run("1\n") == "1=1", "minimum value"
assert run("4\n") == "4=3+1", "needs combination with 1"
assert run("8\n") == "8=7+1", "combination with largest prime first"
assert run("28\n") == "28=23+5", "sum of two primes"
assert run("10\n") == "10=7+3", "largest primes sum to n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 | 1 = 1 | 处理的最小输入
 | 4 | 4=3+1 | 与 1 | 的非平凡组合
 | 8 | 8=7+1 | 最大素数的贪心选择|
 | 28 | 28 28=23+5 | 需要多个素数 |
 | 10 | 10 10=7+3 | 两个素数之和 |

 ## 边缘情况

 对于`n = 1`，筛子不会产生 ≤ 1 的素数，但我们处理`n == 1`分别给予`1=1`。 为了`n`本身是素数，就像`11`，算法立即终止`[n]`，保证最大的元素最先出现。 对于像这样的数字`4`，≤ 4 的最大素数为 3，余数为 1。相加`1`给出一个有效的序列`[3,1]`。 这些检查确保最小、质数和组合情况的正确性。
