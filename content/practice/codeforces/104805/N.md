---
title: "CF 104805N - 第一句话"
description: "我们得到了一本维罗妮卡知道的单词小词典，然后是一个长字符串，代表伊戈尔写下的她的口头独白。"
date: "2026-06-28T13:22:47+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104805
codeforces_index: "N"
codeforces_contest_name: "Central Russia Regional Contest, 2022"
rating: 0
weight: 104805
solve_time_s: 58
verified: true
draft: false
---

[CF 104805N - 第一句话](https://codeforces.com/problemset/problem/104805/N)

 **评级：** -
 **标签：** -
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一本维罗妮卡知道的单词小词典，然后是一个长字符串，代表伊戈尔写下的她的口头独白。 任务是确定是否可以通过连接一些已知单词序列来形成长字符串，而无需插入或删除字符。 

换句话说，我们想知道是否可以分割字符串`s`成一系列连续的子字符串，其中每个子字符串恰好是给定单词之一。 同一个单词可以多次重复使用，我们不需要使用所有单词，只需足以完全覆盖整个字符串即可。 

输入大小最多允许 100 个已知单词，总组合长度最多 100,000，独白字符串`s`长度也可以长达 100,000 个字符。 这立即排除了任何在指数时间内尝试字符串的所有可能分段的方法。 反复扫描的解决方案`s`有效地，或对位置进行动态规划`s`，是必要的。 

当单词重叠或共享前缀时，会出现微妙的边缘情况。 例如，如果字典包含`"a"`,`"aa"`， 和`"aaa"`，字符串是`"aaaaa"`，天真的贪婪方法可能会因过早选择短匹配而失败。 如果我们尝试在每个位置匹配单词而不进行索引，则会出现另一个问题，这可能会退化为对每个字符位置的所有单词进行重复的完整扫描。 

## 方法

 一个蛮力的想法是从索引开始`0`在`s`并递归地尝试与当前前缀匹配的每个字典单词，然后从该匹配的末尾继续。 这是对字符串中位置的简单深度优先搜索。 

虽然这种方法是正确的，但它可能会多次重复相同的子问题。 从给定的索引`s`，我们可能会尝试一次又一次地匹配所有单词。 在最坏的情况下，每个位置最多分为 100 个选择，每个匹配的成本高达 O（单词长度），导致对抗性输入出现指数行为。 

关键的观察结果是，问题仅取决于当前的索引`s`，而不是我们如何到达那里。 这提出了一个动态规划公式：对于每个位置`i`，我们想知道后缀是否`s[i:]`可以完全分段。 计算完成后，应重复使用该结果。 

我们可以通过迭代单词并检查是否存在来加速匹配`s[i:i+len(word)]`等于这个词。 由于总字长是有限的，因此这种直接比较足够有效。 或者，可以构建一个特里树，但在有限制的情况下，每个位置的这个小字典扫描就足够了。 

最终的解决方案成为 DP 的位置`s`，我们尝试使用所有字典单词向前扩展有效状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力DFS | O(exp) | O(n) | 太慢了|
 | DP 超过头寸 | O(n * 总单词数) | O(n) | 已接受 |

 ## 算法演练

 我们定义一个布尔数组`dp`， 在哪里`dp[i]`表示是否有前缀`s[0:i]`可以分割成已知的单词。 

1. 初始化`dp[0] = True`，因为空前缀始终有效。 所有其他位置都以 False 开头。 
2. 迭代位置`i`从`0`到`len(s)`。 
3.如果`dp[i]`是 False，跳过它。 这意味着没有有效的分段到达位置`i`，所以从它延伸是没有用的。 
4. 对于每个已知的单词`w`，检查子串是否开始于`i`比赛`w`， IE。，`s[i:i+len(w)] == w`。 
5. 如果匹配，则设置`dp[i + len(w)] = True`，因为我们可以将有效的分段扩展到该端点。 
6. 处理完所有位置后，检查`dp[len(s)]`。 如果为True，则输出“YES”，否则输出“NO”。 

### 为什么它有效

 在每个索引处`i`,`dp[i]`准确地表示是否存在有效的前缀分段`i`。 当我们使用单词扩展时，我们只附加有效的字典单词，因此任何新标记的状态都对应于有效的分段。 相反，任何有效的分段都必须以某个字典单词结束，并且转换最终将标记相应的端点。 这确保了不会错过任何有效的构造，也不会引入无效的构造。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    words = [input().strip() for _ in range(n)]
    s = input().strip()

    L = len(s)
    dp = [False] * (L + 1)
    dp[0] = True

    for i in range(L):
        if not dp[i]:
            continue

        for w in words:
            lw = len(w)
            if i + lw <= L and s[i:i + lw] == w:
                dp[i + lw] = True

    print("YES" if dp[L] else "NO")

if __name__ == "__main__":
    solve()
```实施直接遵循DP的制定。 外循环迭代字符串中的位置，并且仅从可到达的位置尝试转换，这避免了不必要的工作。 子串比较`s[i:i+lw] == w`是安全的，因为我们在切片之前显式检查边界。 

这里的一个常见错误是忘记将转换限制为可达`dp[i] == True`，这会错误地允许从无效前缀构建段。 另一个微妙的问题是在切片之前不检查边界，这可能导致不正确的部分匹配或浪费工作。 

## 工作示例

 我们使用提供的样本。 

输入：```
4
bububu
mama
papa
matan
bububumatanbububumama
```我们追踪`dp[i]`仅在相关职位。 

| 我| dp[i] | dp[i] | 匹配的词 | 更新职位 |
 | --- | --- | --- | --- |
 | 0 | 真实| 布布布| dp[6] = 真 |
 | 0 | 真实| 没有其他 | - |
 | 6 | 真实| 马坦 | dp[11] = 真 |
 | 11 | 11 真实| 布布布| dp[17] = 真 |
 | 17 | 17 真实| 妈妈 | dp[21] = 真 |

 在最后，`dp[21] = True`，所以答案是肯定的。 

该跟踪表明多个字典单词可以链接起来，并且 DP 正确地累积了可达边界。 

我们还可以考虑一个失败的案例：

 输入：```
2
ab
aba
abab
```在`i = 0`， 两个都`"ab"`和`"aba"`是可能的转变。 DP 标记位置 2 和 3。从 2，我们通过以下方式到达 4：`"ab"`，因此完全覆盖是可能的。 这说明了为什么探索所有转变都是必要的，而不仅仅是贪婪的选择。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * m * k) | O(n * m * k) | n 是 s 的长度，m 是单词数，k 是子串比较产生的平均单词长度 |
 | 空间| O(n) | 字符串位置上的 dp 数组 |

 给定 n ≤ 100,000 且 m ≤ 100，该乘积在 Python 中仍然可以接受，因为每个转换都是一个简单的有界子串比较，并且早期跳过无法到达的状态显着减少了实践中的工作量。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return solve_and_capture()

def solve_and_capture():
    import sys
    input = sys.stdin.readline

    n = int(input())
    words = [input().strip() for _ in range(n)]
    s = input().strip()

    L = len(s)
    dp = [False] * (L + 1)
    dp[0] = True

    for i in range(L):
        if not dp[i]:
            continue
        for w in words:
            lw = len(w)
            if i + lw <= L and s[i:i+lw] == w:
                dp[i+lw] = True

    return "YES" if dp[L] else "NO"

# provided sample
assert run("""4
bububu
mama
papa
matan
bububumatanbububumama
""") == "YES"

# single word exact match
assert run("""1
abc
abc
""") == "YES"

# impossible case
assert run("""2
a
b
abx
""") == "NO"

# repeated concatenation
assert run("""2
ab
aba
abab
""") == "YES"

# long chain
assert run("""3
a
aa
aaa
aaaaaa
""") == "YES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单字匹配| 是 | 基本验收 |
 | 不可能的字符串| 否 | 驳回案例 |
 | 重复串联 | 是 | 分支正确性 |
 | 重叠词| 是 | 非贪婪转移 |

 ## 边缘情况

 一个关键的边缘情况是字典单词重叠，贪婪的选择会失败。 考虑`words = ["a", "aa"]`和`s = "aaa"`。 算法集`dp[1]`,`dp[2]`， 和`dp[3]`正确，因为它会探索每个可到达索引处的两个扩展。 贪婪的方法可能需要`"aa"`首先并被卡住，但 DP 仍然保留`"a"`作为替代路径。 

另一种边缘情况是多个单词在同一位置匹配时。 由于转换是附加的，标记多个端点可确保不会丢失有效的分段。 

最后，空的可达性被干净地处理：如果`dp[i]`永远不会到达，那里不会产生任何转换，从而防止无效传播到以后的状态。
