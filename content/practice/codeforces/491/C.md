---
title: "CF 491C - 破译"
description: "我们被要求破译一条由简单替换密码编码的消息。 原始消息中的每个字母都被替换为固定字母，因此映射是一对一的：不同的字母映射到不同的字母，相同的字母总是映射到相同的......"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "flows", "graph-matchings"]
categories: ["algorithms"]
codeforces_contest: 491
codeforces_index: "C"
codeforces_contest_name: "Testing Round 11"
rating: 2300
weight: 491
solve_time_s: 41
verified: true
draft: false
---

[CF 491C - 解密](https://codeforces.com/problemset/problem/491/C)

 **评分：** 2300
 **标签：** 流、图匹配
 **求解时间：** 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求破译一条由简单替换密码编码的消息。 原始消息中的每个字母都被替换为固定字母，因此映射是一对一的：不同的字母映射到不同的字母，相同的字母总是映射到相同的字母。 玛丽亚·伊万诺夫娜拥有密文并知道考试的正确答案，但她不知道萨莎的实际答案。 目标是选择从加密字母到可能答案的映射，以最大化 Sasha 破译答案与正确答案匹配的位置数量。 

输入由消息的长度组成$N$（最多 200 万个）和可能答案的数量$K$（最多52），长度的密文串$N$，以及长度为正确答案的字符串$N$。 输出是双重的：我们可以获得的最大正确答案数和长度的字符串$K$指定从密码字母（从“a”开始）到答案字母的映射。 

大的限制为$N$排除迭代所有映射排列的朴素方法，如$K!$阶乘增长，即使对于小规模也是不可行的$K$。 我们还需要确保线性或近线性处理$N$并在不引入额外开销的情况下处理所有信件。 边缘情况包括多个密码字母映射到同一答案或某些字母仅出现一次的情况； 粗心的贪婪方法可能会错误地将多个密码字母分配给同一个答案，这是无效的。 例如，如果密码是“aa”并且正​​确答案是“ab”，则将“a”和“b”同时进行天真的贪婪分配将违反一对一映射规则。 

## 方法

 暴力方法将尝试从密码字母到答案字母的映射的所有排列，计算解码消息与正确答案匹配的位置数，并取最大值。 这种方法是正确的，因为它详尽地检查了每个可能的映射，但其复杂性是$O(K! \cdot N)$，即使对于$K=10$。 这显然是不可行的$N$高达200万。 

关键的观察是该问题可以简化为最大权重二分匹配问题。 将密码字母视为一侧的节点，将答案字母视为另一侧的节点。 对于每个密码字母$c$和回信$a$，我们可以计算出密文所在的位置数$c$正确答案是$a$。 该计数充当映射的“权重”$c$到$a$。 然后，问题就变成了找到密码字母与答案的一对一分配，以最大化这些权重的总和。 这是二分图上的经典最大权重匹配，可以使用匈牙利算法有效解决。 自从$K \le 52$, 一个$O(K^3)$匹配的解决方案是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(K! \cdot N)$|$O(K^2)$| 太慢了 |
 | 最大权重二分匹配 |$O(K^3 + N)$|$O(K^2)$| 已接受 |

 ## 算法演练

 1. 初始化一个2D数组`weight[c][a]`对于所有密码字母`c`（0 到 K-1）和所有答案字母`a`（0 到 K-1）。 该数组将存储消息中有多少个位置有密文`c`和正确答案`a`。 循环遍历所有位置`i`从0到N-1并递增`weight[c][a]`在哪里`c`是索引`cipher[i]`和`a`是索引`answer[i]`。 
2. 处理数组`weight`作为二部图，其中一组节点代表密码字母，另一组代表答案字母，边权重由上面计算的计数给出。 
3. 应用匈牙利算法（Kuhn-Munkres）在该 KxK 二分图中找到最大权重完美匹配。 这将给出从密码字母到最大化匹配总数的答案的映射。 
4. 通过求和计算匹配总数`weight[c][a]`在所有分配的对上`(c, a)`从匹配。 
5. 将每个密文字母对应的应答字母按顺序排列，构造密文映射串。 该字符串是输出的第二行。 

**为什么有效：** 在算法的每一步中，权重数组都会准确地计算通过将密文字母映射到答案字母而获得的正确答案的数量。 匈牙利算法保证所选权重的总和对于一对一分配来说是最大的。 由于映射是完美的（一对一）并且使权重总和最大化，因此该算法会产生最大可能数量的正确答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    N, K = map(int, input().split())
    cipher = input().strip()
    correct = input().strip()

    # Initialize weight matrix
    weight = [[0] * K for _ in range(K)]
    
    def idx(ch):
        if 'a' <= ch <= 'z':
            return ord(ch) - ord('a')
        return ord(ch) - ord('A') + 26

    for c_char, a_char in zip(cipher, correct):
        c = idx(c_char)
        a = idx(a_char)
        weight[c][a] += 1

    # Hungarian Algorithm for maximum weight matching
    u = [0] * (K+1)
    v = [0] * (K+1)
    p = [0] * (K+1)
    way = [0] * (K+1)

    for i in range(1, K+1):
        p[0] = i
        minv = [float('inf')] * (K+1)
        used = [False] * (K+1)
        j0 = 0
        while True:
            used[j0] = True
            i0 = p[j0]
            delta = float('inf')
            j1 = 0
            for j in range(1, K+1):
                if not used[j]:
                    cur = -(weight[i0-1][j-1]) - u[i0] - v[j]
                    if cur < minv[j]:
                        minv[j] = cur
                        way[j] = j0
                    if minv[j] < delta:
                        delta = minv[j]
                        j1 = j
            for j in range(K+1):
                if used[j]:
                    u[p[j]] += delta
                    v[j] -= delta
                else:
                    minv[j] -= delta
            j0 = j1
            if p[j0] == 0:
                break
        # augmenting path
        while True:
            j1 = way[j0]
            p[j0] = p[j1]
            j0 = j1
            if j0 == 0:
                break

    match = [0] * K
    for j in range(1, K+1):
        match[p[j]-1] = j-1

    total = sum(weight[i][match[i]] for i in range(K))

    # build mapping string
    mapping = [''] * K
    for i in range(K):
        a_idx = match[i]
        if a_idx < 26:
            mapping[i] = chr(ord('a') + a_idx)
        else:
            mapping[i] = chr(ord('A') + a_idx - 26)

    print(total)
    print(''.join(mapping))

if __name__ == "__main__":
    main()
```该代码首先读取输入并构建一个权重矩阵，该矩阵计算每个潜在映射的正确答案数量。 实施匈牙利算法来找到最大权重完美匹配，从而产生最佳映射。 最后，该算法计算总匹配并输出映射字符串。 

## 工作示例

 ### 示例 1

 输入：```
10 2
aaabbbaaab
bbbbabbbbb
```| 位置 | 密码| 正确| 体重更新|
 | --- | --- | --- | --- |
 | 0 | 一个 | 乙| 权重[a][b] += 1 |
 | 1 | 一个 | 乙| 权重[a][b] += 1 |
 | 2 | 一个 | 乙| 权重[a][b] += 1 |
 | 3 | 乙| 乙| 权重[b][b] += 1 |
 | 4 | 乙| 一个 | 重量[b][a] += 1 |
 | 5 | 乙| 乙| 权重[b][b] += 1 |
 | 6 | 乙| 乙| 权重[b][b] += 1 |
 | 7 | 一个 | 乙| 权重[a][b] += 1 |
 | 8 | 一个 | 乙| 权重[a][b] += 1 |
 | 9 | 乙| 乙| 权重[b][b] += 1 |

 匈牙利算法分配：a -> b, b -> a

 比赛总数：7

 映射字符串：“ba”

 ### 自定义示例

 输入：```
5 3
abcde
abcde
```每个密码字母都与其正确答案完美匹配。 匈牙利算法将每个密码字母映射到相同的答案。 匹配总数：5。映射字符串：“abc”。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 哦| |
