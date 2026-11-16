---
problem: 959B
contest_id: 959
problem_index: B
name: "Mahmoud and Ehab and the message"
contest_name: "Codeforces Round 473 (Div. 2)"
rating: 1200
tags: ["dsu", "greedy", "implementation"]
answer: passed_samples
verified: true
solve_time_s: 67
date: 2026-06-17
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a327fbf-b66c-83ec-981d-3b18ee9546df
---

# CF 959B - Mahmoud 和 Ehab 以及消息

 **评分：** 1200
 **标签：** DSU、贪婪、实现
 **型号：** gpt-5-3-mini
 **求解时间：** 1m 7s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a327fbf-b66c-83ec-981d-3b18ee9546df

 ---

 ## 解决方案

 ## 问题理解

 我们得到一个词汇表，其中每个单词都有固定的发送成本，并且某些单词由于具有相同的含义而被分组在一起。 在一个组中，任何单词都可以被同一组中的任何其他单词替换，而不会改变消息的含义。 

消息是单词的序列。 对于消息中的每个单词，我们可以按原样发送它，也可以用其等价组中的另一个单词替换它。 我们为该位置支付的成本只是我们选择发送的单词的成本。 

目标是最小化发送完整消息的总成本。 

重要的结构是每个单词恰好属于一个组，并且仅允许在该组内进行替换。 这将问题转化为为每个消息词选择其组内最便宜的代表。 

限制最多为 100,000 个单词、组和消息长度。 这立即排除了任何尝试使用组成员的嵌套搜索来探索每个单词的替换的解决方案。 如果组很大，则对其组进行简单的每个单词扫描就已经太慢了，因为总工作可能会退化为二次行为。 

当一个组包含一个非常昂贵的单词和一个非常便宜的单词时，就会出现微妙的失败情况。 如果我们错误地认为我们应该始终保留原始单词，我们就会错过改进。 例如，如果一个组是`{A(cost 100), B(cost 1)}`并且该消息包含`A`，最优答案使用`B`反而。 任何不预先计算每组最低成本的解决方案都将在这里失败。 

当组是单例时，会出现另一种边缘情况。 这种情况下是不可能更换的，所以必须直接使用原来的成本。 这不应该破坏逻辑，但如果组处理假设至少有两个元素，则很容易处理不当。 

## 方法

 暴力方法将独立处理每个消息词。 对于消息中的每个单词，我们找到其组并扫描该组中的所有单词以找到最小成本。 如果我们假设最坏情况的分组，其中几乎所有单词都属于一个大组，则每个查询的成本可能为 O(n)，并且对于 m 个查询，这会导致 O(nm)，这对于 10^5 约束来说太大了。 

关键的观察结果是，消息成本仅取决于每个组内的最小成本，而不取决于替换的结构。 一旦我们知道每个等价类中最便宜的单词，该类中任何单词的每次出现都可以被该最便宜的单词替换。 

这将问题简化为预处理步骤：为每个组计算其成员之间的最小成本。 然后将每个单词映射到其组的最小成本，并对消息求和。 

我们可以使用从单词到索引的哈希映射、将索引映射到组 ID 的数组以及存储组最小成本的数组来有效地实现这一点。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(纳米) | O(n) | 太慢了 |
 | 最佳| O(n + m + n) | O(n + m + n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有单词并为每个单词分配一个索引。 

这允许从消息字符串到其成本和组的恒定时间查找。 
2. 读取成本数组并将每个成本与其字索引相关联。 

现在每个字都知道其发送成本。 
3. 构建从每个单词索引到其组 ID 的映射。 

由于每个单词都属于一个组，因此这是一个直接分配。 
4. 对于每个组，计算该组中所有单词的最小成本。 

我们扫描一次组成员并保持运行最小值。 
5. 对于消息中的每个单词，将其转换为其索引，然后用预先计算的组最小成本替换其成本。 

这对允许的最佳替代进行了建模。 
6. 将所有消息字的这些最小成本相加并输出结果。 

### 为什么它有效

 每个消息词在替换选择方面都是独立的。 唯一的限制是替代者必须留在同一组内。 由于消息中的位置之间没有交互，因此独立优化每个位置是全局最优的。 在一个组中，选择除最小成本词之外的任何其他词只会增加成本，因此对于每次出现，最小值始终是最佳的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k, m = map(int, input().split())
    
    words = input().split()
    cost = list(map(int, input().split()))
    
    idx = {w: i for i, w in enumerate(words)}
    
    group = [-1] * n
    group_min = [10**18] * k
    
    for gid in range(k):
        data = list(map(int, input().split()))
        x = data[0]
        members = data[1:]
        for v in members:
            v -= 1
            group[v] = gid
            group_min[gid] = min(group_min[gid], cost[v])
    
    msg = input().split()
    
    ans = 0
    for w in msg:
        i = idx[w]
        g = group[i]
        ans += group_min[g]
    
    print(ans)

if __name__ == "__main__":
    solve()
```该解决方案构建了一个从单词到索引的字典，因此消息查找的时间是恒定的。 然后，它将每个单词分配给一个组，同时计算该组的最小成本。 消息的最后一个循环只是将每个单词转换为其组 ID，并累积相应的最小成本。 从索引中减去 1 是必要的，因为输入组是基于 1 的。 

一个常见的陷阱是在查询期间重新计算组最小值而不是预处理。 这会将每个消息查找变成对一个组的扫描，这是不必要的而且太慢。 

## 工作示例

 ### 示例 1

 输入：```
5 4 4
i loser am the second
100 1 1 5 10
1 1
1 3
2 2 5
1 4
i am the second
```| 词| 索引 | 组 | 团体最低成本| 使用成本|
 | --- | --- | --- | --- | --- |
 | 我| 0 | 0 | 100 | 100 100 | 100
 | 上午 | 2 | 1 | 1 | 1 |
 | | 的 | 3 | 3 | 5 | 5 |
 | 第二 | 4 | 2 | 1 | 1 |

 总数为 107。 

该痕迹表明，即使“第二”很昂贵，它也会被该组中最便宜的单词“loser”所取代。 

### 示例 2

 输入：```
3 2 3
a b c
10 20 30
1 1
2 2 3
a b c
```| 词| 索引 | 组 | 团体最低成本| 使用成本|
 | --- | --- | --- | --- | --- |
 | 一个 | 0 | 0 | 10 | 10 10 | 10
 | 乙| 1 | 1 | 20 | 20 |
 | c | 2 | 1 | 20 | 20 |

 总数为 50。 

这证实了在包含多个单词的组中，所有出现都使用相同的最便宜的代表。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + k + m) | 每个单词、组成员资格和消息令牌都会处理一次 |
 | 空间| O(n) | 用于字映射、组分配和组最小值的数组 |

 该解决方案很容易满足限制，因为所有操作在输入大小上都是线性的，并且字典查找平均时间是恒定的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import builtins
    return main(inp) if False else solve_capture(inp)

def solve_capture(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, k, m = map(int, input().split())
    words = input().split()
    cost = list(map(int, input().split()))
    idx = {w: i for i, w in enumerate(words)}

    group = [-1] * n
    group_min = [10**18] * k

    for gid in range(k):
        data = list(map(int, input().split()))
        x = data[0]
        members = data[1:]
        for v in members:
            v -= 1
            group[v] = gid
            group_min[gid] = min(group_min[gid], cost[v])

    msg = input().split()

    ans = 0
    for w in msg:
        ans += group_min[group[idx[w]]]

    return str(ans)

# provided sample
assert solve_capture("""5 4 4
i loser am the second
100 1 1 5 10
1 1
1 3
2 2 5
1 4
i am the second
""") == "107"

# singleton groups
assert solve_capture("""3 3 3
a b c
5 1 10
1 1
1 2
1 3
a b c
""") == "16"

# all in one group
assert solve_capture("""3 1 3
a b c
10 5 7
3 1 2 3
a b c
""") == "15"

# already optimal
assert solve_capture("""2 2 2
x y
3 4
1 1
1 2
x y
""") == "7"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品| 107 | 107 基本正确性|
 | 单例组 | 16 | 16 无法更换|
 | 全部在一组 | 15 | 15 全局最小传播|
 | 已经是最优的 | 7 | 没有不必要的更换|

 ## 边缘情况

 单例组，例如`1 1`确保该词没有其他选择。 该算法将其自身成本指定为组最小值，因此查询可以正确使用原始值。 

包含所有单词的大组测试预处理是否正确地将单个最小值传播到所有消息位置。 该算法计算一个全局最小值并一致地应用它。 

多次重复同一单词的消息会检查查找是否稳定并且不会重新计算或改变状态。 每次出现都会独立获取相同的预先计算的组最小值，从而保持正确性。
