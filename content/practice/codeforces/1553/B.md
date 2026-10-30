---
title: "CF 1553B - 反向字符串"
description: "我们得到一个表示一行字符的字符串。 芯片从该字符串中的某个选定位置开始。 放置好后，我们反复移动它，每次都将字符记录在芯片的当前位置。"
date: "2026-06-18T18:50:09+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dp", "hashing", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1553
codeforces_index: "B"
codeforces_contest_name: "Harbour.Space Scholarship Contest 2021-2022 (open for everyone, rated, Div. 1 + Div. 2)"
rating: 1300
weight: 1553
solve_time_s: 94
verified: false
draft: false
---

[CF 1553B - 反转字符串](https://codeforces.com/problemset/problem/1553/B)

 **评分：** 1300
 **标签：** 暴力破解、dp、哈希、实现、字符串
 **求解时间：** 1m 34s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个表示一行字符的字符串。 芯片从该字符串中的某个选定位置开始。 放置好后，我们反复移动它，每次都将字符记录在芯片的当前位置。 该运动具有严格的结构：芯片首先仅向右移动一定步数，之后它可能会切换方向并仅向左移动一定步数。 它再也不会切换回向右移动。 

这意味着记录的序列总是通过沿着字符串的连续段行走来生成，首先增加索引，然后可能减少索引，并且恰好有一个方向翻转的转折点。 

任务是决定是否可以将目标字符串生成为针对某些起始位置和某些移动选择的访问字符序列。 

约束足够小，单个测试用例的二次甚至三次解都是可以接受的。 所有测试的字符串长度总和最多为 500，这会立即排除在最坏情况下超过大约 O(n3) 的优化需要。 即使每个测试用例的 O(n²) 也是安全的。 

一些微妙的情况对于正确性很重要。 

一个问题是路径永远不会向左移动。 例如，如果我们从位置 3 开始并且仅向右移动，则生成的字符串是原始字符串的简单子字符串。 假设我们必须始终至少转动一次的幼稚方法会错误地拒绝此类情况。 

另一个问题是路径在放置后永远不会移动。 从位置 i 开始并立即向左移动也是有效的，产生一个索引严格递减的序列。 例如，对于 s =“abcde”，从索引 4 开始并向左移动两次会生成“edc”。 强制最初采取正确行动的解决方案会错过这一点。 

最后，许多不正确的方法假设答案仅取决于匹配子字符串或反转子字符串，但关键的复杂性是序列可以恰好改变方向一次，这允许像“abcba”这样的形状或像“abcdc”这样的部分版本。 

## 方法

 直接的强力解释是尝试每个起始位置并模拟所有可能的运动模式。 从起始索引 i 开始，我们可以选择向右移动多少步，然后向左移动多少步，并显式构造结果字符串以与 t 进行比较。 这是正确的，因为它完全遵循定义的流程。 然而，对于每个起始位置，右移和左移长度有 O(n²) 个选择，构建每个结果字符串的成本为 O(n)，导致每次起始的 O(n³) 和最差概念形式的总体 O(n⁴)。 即使n很小，但这也是不必要的并且浪费结构。 

关键的观察是，我们永远不需要单独决定向左或向右移动多远。 一旦我们确定了起始位置，路径就完全由沿着索引移动且最多有一个方向变化的序列来描述。 这是在线图上的约束行走，它建议对字符串中的位置和目标中的位置进行动态规划公式。 

我们不是枚举移动长度，而是跟踪当前是向右还是向左移动，并强制方向最多可以从右到左切换一次。 这将问题简化为检查我们是否可以将 t 与大小为 O(n) 的小状态图中的路径对齐。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 所有动作的暴力模拟| O(n⁴) 最差概念 | O(n) | 太慢了 |
 | DP 超过位置、索引、方向 | O(n3) 或 O(n2) 优化 | O(n²) 或 O(n) | 已接受 |

 ## 算法演练

我们将该过程建模为在匹配目标字符串的字符时遍历字符串中的索引。 

1. 我们尝试字符串中每个可能的起始索引作为初始芯片放置。 这是必要的，因为该过程可以从任何地方开始，并且 t 的第一个字符必须与所选的起始位置匹配。 
2. 从固定的起始位置开始，我们尝试使用由字符串中的当前索引、t 中的索引和当前移动方向组成的状态来匹配目标字符串。 方向可以是“向右移动”或“向左移动”。 
3. 一开始，我们并没有被强迫进入一个方向，所以我们分成两种可能性：第一步向右走，或者第一步向左走。 这捕获了步行立即转向或沿一个方向继续一段时间的两种情况。 
4. 如果我们处于“向右移动”状态，我们可能会从位置 i 移动到 i+1，消耗 t 的下一个字符。 我们还允许随时从“向右移动”到“向左移动”的单一过渡，代表行走的转折点。 
5. 如果我们处于“向左移动”状态，我们可能会从位置 i 移动到 i-1，再次消耗 t 的一个字符。 我们不允许切换回向右移动，因为该过程只允许一个方向的改变。 
6. 我们继续这个过程，直到我们消耗掉 t 的所有字符或者所有可能的状态都被耗尽。 如果任何路径恰好消耗 t，则答案是肯定的。 

状态机强制执行的关键约束是方向最多改变一次且仅从右到左改变。 

### 为什么它有效

 筹码运动的每个有效构造都准确地对应于从某个索引开始并遵循字符串图中的一系列边的行走，首先增加索引，然后选择性地减少它。 我们的 DP 通过仅编码当前位置、t 中的进度和方向阶段来枚举所有此类行走，而无需重复。 因为每个转换都反映了芯片的有效移动，并且我们从不允许无效的方向变化，所以任何接受的状态都会重建一个有效的过程，并且 DP 可以遵循任何有效的过程，因为它从不排除合法的转换。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(s, t):
    n, m = len(s), len(t)
    
    for start in range(n):
        if s[start] != t[0]:
            continue
        
        # dp[pos][dir][idx] is too large explicitly,
        # we compress by iterative BFS-style DP over states
        # state: (pos, idx, dir)
        # dir: 0 = right, 1 = left
        
        from collections import deque
        
        vis = set()
        q = deque()
        
        # initial state: at start, matched first character
        # we can choose next direction as right or left
        q.append((start, 0, 0))  # go right
        q.append((start, 0, 1))  # go left
        vis.add((start, 0, 0))
        vis.add((start, 0, 1))
        
        while q:
            pos, i, d = q.popleft()
            
            if i == m - 1:
                return True
            
            if d == 0:
                # move right
                if pos + 1 < n and s[pos + 1] == t[i + 1]:
                    nxt = (pos + 1, i + 1, 0)
                    if nxt not in vis:
                        vis.add(nxt)
                        q.append(nxt)
                # switch to left
                if pos - 1 >= 0 and s[pos - 1] == t[i + 1]:
                    nxt = (pos - 1, i + 1, 1)
                    if nxt not in vis:
                        vis.add(nxt)
                        q.append(nxt)
            else:
                # moving left only
                if pos - 1 >= 0 and s[pos - 1] == t[i + 1]:
                    nxt = (pos - 1, i + 1, 1)
                    if nxt not in vis:
                        vis.add(nxt)
                        q.append(nxt)
    
    return False

def main():
    q = int(input())
    for _ in range(q):
        s = input().strip()
        t = input().strip()
        print("YES" if solve_case(s, t) else "NO")

if __name__ == "__main__":
    main()
```该解决方案迭代所有起始位置，并从每个起始位置启动小型状态搜索。 BFS 状态对字符串中的当前位置、目标字符串中的进度以及我们当前是向右还是向左移动进行编码。 转换逻辑直接反映了允许的芯片移动：从右移动状态我们可以继续右移动或切换到左一次，而从左移动状态我们只能继续左移动。 

访问集很重要，因为可以通过不同的运动历史达到相同的配置，并且重新访问它会导致指数爆炸。 由于每次启动状态空间最多为 n × m × 2，因此在给定约束下这仍然有效。 

## 工作示例

 ### 示例 1

 s =“abcdef”，t =“cdedcb”

 我们尝试从位置 2 ('c') 开始。 

| 步骤| 位置| t指数| 方向 | 行动|
 | ---| ---| ---| ---| ---|
 | 0 | 2 | 0 | 对| 从 'c' 开始 |
 | 1 | 3 | 1 | 对| 向右移动到 'd' |
 | 2 | 4 | 2 | 对| 向右移动到 'e' |
 | 3 | 3 | 3 | 左| 切换并向左移动到“d” |
 | 4 | 2 | 4 | 左| 向左移动到“c”|
 | 5 | 1 | 5 | 左| 向左移动到 'b' |

 这与目标完全匹配，显示了有效的从右到左的轨迹。 

### 示例 2

 s =“ab”，t =“b”

 我们从位置 1 ('b') 开始。 

| 步骤| 位置| t指数| 方向 | 行动|
 | ---| ---| ---| ---| ---|
 | 0 | 1 | 0 | 左| 从“b”开始，无需移动 |

 这表明零移动案例是有效的并且必须被接受。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个完整解决方案的最坏情况为 O(n³)，实际上在实践中要小得多 | 每次开始最多探索 O(n × m × 2) 状态，并且总 n 很小 |
 | 空间| O(n × m) | 每次启动时访问的状态存储可防止重新计算 |

 这些约束保证所有测试的总 n 最多为 500，因此即使是立方体探索也仍然在限制范围内。 BFS 状态修剪可确保实际运行时间在典型情况下更接近二次行为。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    
    def solve():
        q = int(input())
        out = []
        for _ in range(q):
            s = input().strip()
            t = input().strip()
            
            n, m = len(s), len(t)
            from collections import deque
            
            def ok():
                for start in range(n):
                    if s[start] != t[0]:
                        continue
                    
                    qd = deque()
                    vis = set()
                    qd.append((start, 0, 0))
                    qd.append((start, 0, 1))
                    vis.add((start, 0, 0))
                    vis.add((start, 0, 1))
                    
                    while qd:
                        pos, i, d = qd.popleft()
                        if i == m - 1:
                            return True
                        if d == 0:
                            if pos + 1 < n and s[pos+1] == t[i+1]:
                                st = (pos+1, i+1, 0)
                                if st not in vis:
                                    vis.add(st)
                                    qd.append(st)
                            if pos - 1 >= 0 and s[pos-1] == t[i+1]:
                                st = (pos-1, i+1, 1)
                                if st not in vis:
                                    vis.add(st)
                                    qd.append(st)
                        else:
                            if pos - 1 >= 0 and s[pos-1] == t[i+1]:
                                st = (pos-1, i+1, 1)
                                if st not in vis:
                                    vis.add(st)
                                    qd.append(st)
                    return False
            
            out.append("YES" if ok() else "NO")
        return "\n".join(out)
    
    return solve()

# provided samples
assert run("""6
abcdef
cdedcb
aaa
aaaaa
aab
baaa
ab
b
abcdef
abcdef
ba
baa
""") == """YES
YES
NO
YES
YES
NO"""

# custom cases
assert run("""1
a
a
""") == "YES", "single char"

assert run("""1
abc
abc
""") == "YES", "no movement needed"

assert run("""1
abc
cba
""") == "YES", "full reverse via left moves"

assert run("""1
abc
acb
""") == "NO", "impossible zigzag"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单字符 | 是 | 最小案例|
 | abc → abc | 是 | 零运动正确性|
 | ABC → CBA | 是 | 完全左遍历 |
 | abc → ab | 否 | 无效方向模式 |

 ## 边缘情况

 当 t 是相同字符时，始终接受长度为 1 的最小字符串。 DP 从唯一的位置开始，匹配第一个字符，并立即成功终止。 

t 等于 s 的情况测试不需要移动的场景。 该算法允许零转换，因为初始状态已经与第一个字符匹配，并且可以在不强制移动的情况下终止。 

完全反转的字符串测试极端情况，即我们仅在放置后向左移动。 从最后一个字符开始，逐步向左移动匹配所有字符，DP 正确地允许初始方向向左移动。 

像向右移动然后需要第二次独立切换回右侧这样的“之字形”模式被拒绝，因为状态机禁止多个方向改变，从而防止无效重建。
