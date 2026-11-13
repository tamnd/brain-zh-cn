---
title: "CF 282E - 香肠最大化"
description: "我们得到一个整数数组，它代表 Bitland 中的一根香肠。 目标是将这个香肠切成两个不重叠的部分：BitHaval 的前缀和 BitAryo 的后缀。 任一段都可以为空。"
date: "2026-06-05T09:20:51+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "data-structures", "trees"]
categories: ["algorithms"]
codeforces_contest: 282
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 173 (Div. 2)"
rating: 2200
weight: 282
solve_time_s: 88
verified: true
draft: false
---

[CF 282E - 香肠最大化](https://codeforces.com/problemset/problem/282/E)

 **评分：** 2200
 **标签：** 位掩码、数据结构、树
 **求解时间：** 1m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组，它代表 Bitland 中的一根香肠。 目标是将这个香肠切成两个不重叠的部分：BitHaval 的前缀和 BitAryo 的后缀。 任一段都可以为空。 每个人的“美味”是其段中整数的按位异或，他们的总快乐是两个美味值的异或。 我们希望最大化这种乐趣。 

输入大小最多为 100,000 个整数，每个整数最大可以为$10^{12}$。 这立即告诉我们，任何在所有可能的前缀后缀分割上使用嵌套循环的解决方案都将太慢：迭代所有前缀和后缀末端对将是$O(n^2)$，其顺序为$10^{10}$运营。 我们需要一些接近线性或至多线性的东西$n$。 

边缘情况在这里很微妙。 最简单的情况是当数组长度为1时。那么唯一的非空段就是元素本身，其他人什么也得不到。 另一种边缘情况是当所有元素都为零时，在这种情况下每个段 XOR 都为零。 粗心的方法可能会假设两个段都必须非空，但问题是允许空段并且它们的 XOR 为零，这可能会改变最佳分割。 

## 方法

 暴力方法迭代每个可能的分割：对于每个前缀结束$i$从 0 到$n$，计算前缀的异或和后缀的异或，然后取它们的异或。 每次从头开始计算前缀和后缀异或是$O(n)$，导致总体$O(n^2)$复杂。 这适用于小型数组，但速度太慢$n = 10^5$。 

我们注意到 XOR 是结合律并且具有以下性质$a \oplus b = c \Rightarrow a = b \oplus c$。 如果我们预先计算前缀 XOR 数组，$\text{px}[i] = a[0] \oplus a[1] \oplus \dots \oplus a[i]$，然后对从位置开始的任何后缀进行异或$j$可以写成$\text{px}[n-1] \oplus \text{px}[j-1]$为了$j > 0$，并且简单地$\text{px}[n-1]$为了$j = 0$。 这减少了重复计算。 

下一个见解是，问题简化为：给定一个前缀 XOR 列表，找到两个不重叠的段，使得它们的 XOR 的 XOR 最大化。 这相当于寻找数组中任意两个数字的最大异或的经典问题。 我们可以使用二进制特里树或独立位向量的基础（也称为线性基础）来解决这个问题。 每个前缀异或可以插入到一个基中，通过查询基得到当前前缀与任意先前前缀的最大异或。 这会产生一个$O(n \cdot \log M)$解，其中$M$是最大可能的整数（$10^{12}$， 所以$\log M \approx 40$）。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 前缀异或+线性基础| O(n log M) | O(n log M) | O(log M) | 已接受 |

 ## 算法演练

 1. 计算前缀异或数组。 让$\text{px}[i] = a[0] \oplus a[1] \oplus \dots \oplus a[i]$。 这允许对任何前缀 XOR 进行 O(1) 计算。 
2. Initialize an empty linear basis for XOR maximization. 线性基是一组数字，其中每个数字在 XOR 方面都是线性独立的，这意味着不能通过对基中的其他数字进行异或来形成任何数字。 
3. 迭代前缀 XOR。 每一步$i$，我们对待$\text{px}[i]$作为 BitAryo 段的潜在 XOR，我们希望与任何先前的前缀（潜在的 BitHaval 段）最大化 XOR。 查询当前基找到最大化的数$\text{px}[i] \oplus \text{basis element}$。 
4.查询后插入$\text{px}[i]$入基础。 这确保了未来的后缀可以使用此前缀 XOR 作为最大 XOR 的候选者。 
5. 跟踪在这些迭代期间找到的全局最大 XOR 并将其输出。 

工作原理：前缀 XOR 数组确保表示每个可能的前缀和后缀 XOR。 线性基础保证我们可以从先前前缀 XOR 的任何子集构造最大可能的 XOR。 由于 XOR 是结合且可逆的，因此此方法会隐式检查所有有效的前缀-后缀分割。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class LinearBasis:
    def __init__(self):
        self.basis = [0] * 64

    def insert(self, x):
        for i in reversed(range(64)):
            if x & (1 << i):
                if self.basis[i]:
                    x ^= self.basis[i]
                else:
                    self.basis[i] = x
                    return

    def query_max(self, x):
        res = x
        for i in reversed(range(64)):
            if self.basis[i]:
                res = max(res, res ^ self.basis[i])
        return res

def main():
    n = int(input())
    a = list(map(int, input().split()))
    
    px = [0] * n
    px[0] = a[0]
    for i in range(1, n):
        px[i] = px[i-1] ^ a[i]

    lb = LinearBasis()
    max_pleasure = 0
    lb.insert(0)  # include empty prefix
    for val in px:
        max_pleasure = max(max_pleasure, lb.query_max(val))
        lb.insert(val)
    print(max_pleasure)

if __name__ == "__main__":
    main()
```该代码首先计算前缀异或。 然后我们维护一个线性基础来快速找到与任何当前前缀异或最大的数。 最初插入 0 可以处理空前缀的情况。 前缀 XOR 上的循环可确保隐式考虑每个不重叠的前缀-后缀分割。 

## 工作示例

 输入示例 1：```
2
1 2
```| 我| px[i] | 最大快乐 | 插入后的基础 |
 | --- | --- | --- | --- |
 | 0 | 1 | 1 | [0, 1] |
 | 1 | 3 | 3 | [0, 1, 3] |

 最大快乐为 3，通过将第一个元素赋予 BitHaval、将第二个元素赋予 BitAryo 来获得。 

自定义输入2：```
3
1 2 3
```| 我| px[i] | 最大快乐 | 插入后的基础 |
 | --- | --- | --- | --- |
 | 0 | 1 | 1 | [0, 1] |
 | 1 | 3 | 3 | [0, 1, 3] |
 | 2 | 0 | 3 | [0, 1, 3] |

 最大快乐是 3，通过给予 BitHaval [1,2] 和 BitAryo [3] 来实现。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * log M) | O(n * log M) | n 个前缀 XOR 插入 64 位线性基 |
 | 空间| 奥(64) | 对于 64 位整数，线性基最多存储 64 个数字 |

 n 最多为$10^5$和 M 至$10^{12}$，总操作量约为$10^5 * 40 = 4 \times 10^6$，轻松低于 2 秒限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import main
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# Provided sample
assert run("2\n1 2\n") == "3", "sample 1"

# Custom tests
assert run("1\n5\n") == "5", "single element"
assert run("3\n1 2 3\n") == "3", "small array"
assert run("4\n0 0 0 0\n") == "0", "all zeros"
assert run("5\n1 1 1 1 1\n") == "1", "all ones"
assert run("6\n3 5 2 7 1 6\n") == "7", "mixed numbers"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1\n5 | 1\n5 5 | 单元素边缘情况 |
 | 3\n1 2 3 | 3\n1 2 3 | 3 | 小阵列，典型案例|
 | 4\n0 0 0 0 | 4\n0 0 0 0 0 | 正确处理所有零 |
 | 5\n1 1 1 1 1 | 5\n1 1 1 1 1 | 1 | 处理重复号码 |
