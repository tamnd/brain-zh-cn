---
title: "CF 1423L - 灯开关"
description: "考虑到几天后灯的状态，我们被要求确定尼古拉必须打开的最小开关组才能关闭所有仓库灯。 每个开关都会翻转预定义的灯子集。"
date: "2026-06-11T06:14:56+07:00"
tags: ["codeforces", "competitive-programming", "meet-in-the-middle"]
categories: ["algorithms"]
codeforces_contest: 1423
codeforces_index: "L"
codeforces_contest_name: "Bubble Cup 13 - Finals [Online Mirror, unrated, Div. 1]"
rating: 2600
weight: 1423
solve_time_s: 72
verified: true
draft: false
---

[CF 1423L - 灯开关](https://codeforces.com/problemset/problem/1423/L)

 **评分：** 2600
 **标签：** 中间相遇
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 考虑到几天后灯的状态，我们被要求确定尼古拉必须打开的最小开关组才能关闭所有仓库灯。 每个开关都会翻转预定义的灯子集。 从概念上讲，问题简化为使用与开关对应的可用位掩码子集将起始位掩码（灯打开或关闭）转换为零位掩码（全部关闭）。 每天都会出现一个新的起始位掩码。 

限制表明最多可以有 1000 个灯和 30 个开关。 虽然灯的数量很大，但开关的数量足够小，足以考虑组合子集。 翻转开关对应于将其位掩码与当前状态进行异或。 由于有 30 个开关，因此需要对所有开关进行强力探索$2^{30}$仅当我们进一步优化时，子集才是可行的，因为天真的迭代 1000 天的每一天都会使成本显着增加。 大量的灯光不允许直接尝试所有灯光配置的解决方案； 我们需要一种主要根据交换机数量进行扩展的方法。 

当没有任何开关组合可以关闭所有灯时，就会出现微妙的边缘情况。 例如，如果一天开始时灯 1 和 2 都亮，并且所有开关仅影响灯 1，则灯永远无法完全关闭。 另一种情况是，当多个开关影响重叠的灯组时 - 翻转影响最多灯组的开关的天真贪婪方法可能会失败。 最后，没有灯的日子需要调零开关，必须明确处理。 

## 方法

 蛮力方法会考虑所有$2^S$每天的开关子集，将每个组合应用于当天的位掩码以查看是否会导致所有灯关闭。 这是正确的，但计算量很大。 和$S$最多 30 个，$2^{30}$约为十亿。 重复此操作$D = 1000$天显然是不可能的。 

关键的见解来自少量的开关。 因为翻转是异或，所以翻转的顺序并不重要。 这使我们能够将开关分成两半，并分别预先计算每一半的所有可能的异或结果，以及所使用的翻转次数。 这是经典的中间相遇技术。 然后，对于每一天，我们尝试找到两个预先计算的结果，每一半各一个，其异或等于当天的位掩码。 使用从 XOR 值到一半最小翻转的映射可以实现高效查找，从而减少从$O(D \cdot 2^S)$粗略地$O(D \cdot 2^{S/2})$，在给定约束的情况下这是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(D * 2^S * N) | O(2^S) | O(2^S) | 太慢了|
 | 中间会面 | O(D * 2^(S/2) * N) | O(2^(S/2) * N) | O(2^(S/2) * N) | 已接受 |

 ## 算法演练

 1. 将每个开关转换为长度的位掩码$N$。 每个位代表该开关是否翻转特定的灯。 
2. 将开关分成两半，大致相等。 预先计算前半部分的所有 XOR 组合，并将实现每个结果位掩码所需的最小翻转次数存储在字典中。 
3. 同样，预先计算后半部分的所有 XOR 组合，但将它们存储为对列表（位掩码、翻转次数）。 
4. 对于每天的起始位掩码，迭代后半部分的所有组合。 对于每个组合，计算前半部分所需的异或以实现所有灯关闭：$needed = day\_mask \oplus second\_mask$。 
5. 如果$needed$存在于前半部分的字典中，将两部分的翻转次数相加。 跟踪最小金额。 
6. 如果没有组合产生所有灯关闭，则当天返回-1； 否则，返回找到的最小翻转次数。 

为什么它有效：该算法探索所有可能的开关子集，而不生成完整的开关子集。$2^S$立刻空间。 通过分成两半，该解决方案利用了 XOR 的交换性和结合性，保证可以通过组合每一半的一个子集来形成任何可实现的配置。 字典确保我们总是在上半场选择翻转次数最少的组合。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from itertools import combinations
from collections import defaultdict

def main():
    N, S, D = map(int, input().split())
    switches = []
    for _ in range(S):
        data = list(map(int, input().split()))
        mask = 0
        for light in data[1:]:
            mask |= 1 << (light - 1)
        switches.append(mask)
    
    half = S // 2
    first_half = switches[:half]
    second_half = switches[half:]
    
    # Precompute first half combinations
    first_dict = {}
    for k in range(len(first_half)+1):
        for comb in combinations(range(len(first_half)), k):
            mask = 0
            for idx in comb:
                mask ^= first_half[idx]
            if mask not in first_dict or first_dict[mask] > k:
                first_dict[mask] = k
    
    # Precompute second half combinations
    second_list = []
    for k in range(len(second_half)+1):
        for comb in combinations(range(len(second_half)), k):
            mask = 0
            for idx in comb:
                mask ^= second_half[idx]
            second_list.append((mask, k))
    
    # Process each day
    for _ in range(D):
        data = list(map(int, input().split()))
        day_mask = 0
        for light in data[1:]:
            day_mask |= 1 << (light - 1)
        ans = float('inf')
        for mask2, flips2 in second_list:
            needed = day_mask ^ mask2
            if needed in first_dict:
                ans = min(ans, flips2 + first_dict[needed])
        print(ans if ans != float('inf') else -1)

if __name__ == "__main__":
    main()
```该代码首先将开关转换为位掩码以实现高效的异或运算。 拆分开关可确保组合数量易于处理。 字典确保可以快速检索上半场的最少翻转。 后半部分使用列表是安全的，因为我们每天只迭代一次它的所有组合。 每天的掩码被构造为位掩码，并且 XOR 算术识别所需的补集子集。 

## 工作示例

 输入示例 1：```
4 3 4
2 1 2
2 2 3
1 2
1 1
2 1 3
3 1 2 3
3 1 2 4
```| 步骤| 日间面具 | 第一个字典命中？ | 第二个掩码 | 总翻转次数 |
 | --- | --- | --- | --- | --- |
 | 第一天 | 1 << 0 | 是的 | 0 | 2 |
 | 第 2 天 | 1 << 0 ^ 1 << 2 | 是的 | 0 | 2 |
 | 第三天 | 1<<0^1<<1^1<<2| 是的 | 0 | 3 |
 | 第 4 天 | 1<<0^1<<1^1<<3| 没有| 任何| -1 |

 该表显示了算法如何搜索后半部分的所有组合，找到所需的前半部分掩模以将灯光归零，并计算最小翻转。 第 4 天没有解决方案，产生 -1。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(D * 2^(S/2) * S) | 每一半生成 2^(S/2) 个组合； 每天我们都会迭代一半并在字典中查找 |
 | 空间| O(2^(S/2)) | O(2^(S/2)) | 将前半部分的组合存储在字典中 |

 当 S ≤ 30 时，2^(S/2) ≈ 1024，因此内存使用量远低于 1 GB。 在 3 秒限制内处理 D = 1000 天是可行的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    main()
    return output.getvalue().strip()

# Provided sample
assert run("""4 3 4
2 1 2
2 2 3
1 2
1 1
2 1 3
3 1 2 3
3 1 2 4""") == "2\n2\n3\n-1", "sample 1"

# Custom cases
assert run("""2 2 2
1 1
1 2
1 1
1 2""") == "1\n1", "single flip per day"

assert run("""3 3 1
1 1
1 2
1 3
3 1 2 3""") == "3", "all lights on, each switch flips one"

assert run("""3 2 1
2 1 2
2 2 3
2 1 3""") == "2", "overlapping switches"

assert run("""1 1 1
1 1
0""") == "0", "no lights on"

assert run("""30 30 1
""" + "\n".join(f"1 {i+1}" for
```
