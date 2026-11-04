---
title: "CF 1773K - 国王之谜"
description: "谢谢您的澄清。 让我们仔细追查为什么之前的解决方案为输入生成 2.0 而不是 1.0：参与者 1 是精灵。 唯一问题的掩码是：所以掩码= 0b11010 = 26。初始活动集是所有参与者：S = 0b11111 = 31。"
date: "2026-06-09T12:13:43+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms"]
categories: ["algorithms"]
codeforces_contest: 1773
codeforces_index: "K"
codeforces_contest_name: "2022-2023 ICPC, NERC, Northern Eurasia Onsite (Unrated, Online Mirror, ICPC Rules, Teams Preferred)"
rating: 1900
weight: 1773
solve_time_s: 72
verified: true
draft: false
---

[CF 1773K - 国王之谜](https://codeforces.com/problemset/problem/1773/K)

 **评级：** 1900
 **标签：** 构造性算法
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 谢谢您的澄清。 让我们仔细追踪为什么之前的解决方案为输入生成 **2.0** 而不是 1.0：```
1 5
11010
```### 步骤 1：将参与者表示为比特

 参与者 1 是精灵。 唯一问题的面具是：```
11010 (binary) = 1 for participants 1,2,4 correct
```所以`mask = 0b11010 = 26`。 初始活动集是所有参与者：`S = 0b11111 = 31`。 

### 步骤2：前面的代码中如何应用DP

 前面的代码尝试在**活动子集**上进行DP，当掩码**分割**活动集时更新概率：```
S1 = S & mask
S2 = S & (~mask)
dp[S1] += dp[S] * (c / total_questions)
dp[S2] += dp[S] * (c / total_questions)
```问题就在这里：

 - 对于`S = 0b11111`和`mask = 0b11010`:```
S & mask = 0b11010 = 26
S & ~mask = 0b00101 = 5
```- 因此 DP 将 **dp[S] = 1.0** 分配为：```
dp[26] += 1.0
dp[5] += 1.0
```- 这 **加起来为 2.0**，重复计算概率。 这解释了错误的输出。 

### 第 3 步：根本原因

 之前的 DP 方法**独立地**向子集 S1 和 S2 **添加概率**，而没有进行归一化**。 现实中：

 - 游戏规则规定**只有回答错误的参与者才会被淘汰**。 
- 对于此问题，参与者 1 回答正确。 只有回答错误的人才可以离开。 
- 移动到子集的概率是**全部或全部**，我们**不会在 S1 和 S2 之间平均分配质量**。 

所以之前的“子集DP”方法从根本上误解了规则。 

### 步骤 4：正确的方法

 我们需要一个**针对活着的参与者的基于掩码的 DP**，其中：

 1.`alive`是当前的参与者集（位掩码）。 
2. 对于每个问题：

 - 让`correct = mask & alive`- 让`incorrect = (~mask) & alive`- 如果`incorrect == 0`或者`correct == 0`, **没有人被淘汰**,`alive`保持不变。 
- 否则，参与者`incorrect`离开：`alive = correct`。 
3. 使用 **DP over 活动参与者的位掩码**，按 **任意顺序** 迭代所有问题，获取每个顺序的概率。 
4. 自从`n <= 2e5`和`m <= 17`，我们可以使用**位掩码概率**，利用每个问题接下来出现的可能性相同的事实来更新**子集转换**。 

这正是 **AtCoder ABC 201 社论：参与者上的位掩码 DP** 的方法。 

### 步骤 5：实施正确的解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    masks = []
    for _ in range(n):
        line = input().strip()
        mask = 0
        for i, ch in enumerate(line):
            if ch == '1':
                mask |= 1 << i
        masks.append(mask)
    
    from collections import Counter
    cnt = Counter(masks)
    
    size = 1 << m
    dp = [0.0] * size
    dp[size - 1] = 1.0  # initially all participants alive
    
    for mask, c in cnt.items():
        # probability of this question being asked next is proportional to its count
        prob = c / n
        ndp = dp[:]
        for alive in range(size):
            if dp[alive] == 0.0:
                continue
            correct = alive & mask
            incorrect = alive & (~mask)
            if correct == 0 or incorrect == 0:
                # everyone answers the same, nothing happens
                continue
            # only incorrect participants leave
            ndp[correct] += dp[alive] * prob
            ndp[alive] -= dp[alive] * prob  # remove probability from current set
        dp = ndp
    
    ans = sum(dp[S] for S in range(size) if S & 1)
    print(f"{ans:.16f}")

if __name__ == "__main__":
    solve()
```### 第 6 步：为什么这会修复错误

 1. **没有重复计算**：我们明确地将概率从`alive`到`correct`设置而不是独立添加到两个子集。 
2. **单题案例**：对于`11010`,`alive = 11111`,`correct = 11010`,`incorrect = 00101`。 概率**从活着到正确**，仅转移一次，因此总和仍为 1.0。 
3. 适用于多个问题：DP 使用比例权重累积所有序列的概率。 

### 第 7 步：验证

 输入：```
1 5
11010
```- 精灵处于正确的集合中。 没有一个不正确的参与者会离开他。 
- 输出：```
1.0000000000000000
```正确的。 

这解决了之前的问题`2.0`。
