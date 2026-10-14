---
title: "CF 106078G - 土星"
description: "我们有一个目标字符串 t 和一个记录数据字符串的列表。 我们可以选择记录字符串的任何子集，但它们的原始顺序不能改变。 将所选字符串连接起来，目标是使目标字符串作为子字符串出现尽可能多的次数。"
date: "2026-06-25T12:09:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106078
codeforces_index: "G"
codeforces_contest_name: "UTPC Contest 9-17-25 Div. 1 (Advanced)"
rating: 0
weight: 106078
solve_time_s: 42
verified: true
draft: false
---

[CF 106078G - 土星](https://codeforces.com/problemset/problem/106078/G)

 **评级：** -
 **标签：** -
 **求解时间：** 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个目标字符串`t`以及记录的数据字符串的列表。 我们可以选择记录字符串的任何子集，但它们的原始顺序不能改变。 将所选字符串连接起来，目标是使目标字符串作为子字符串出现尽可能多的次数。 重叠出现计数，因此在一个位置结束的匹配可以与另一匹配共享字符。 

输入由一个短目标模式和最多 1000 个数据点组成。 每个数据点都是一个长度最多为100的字符串。输出是选择最佳子集后目标可以出现的最大次数。 

影响解决方案的主要约束是目标长度较小。 目标长度最多为20，而数据总量可达100000个字符左右。 尝试字符串的每个子集的解决方案是不可能的，因为选择的数量呈指数级增长。 即使检查每个可能的串联边界也太昂贵了。 我们需要压缩所选字符串之间携带的信息。 

已构建的连接中唯一对未来匹配重要的部分是后缀，它可能成为未来出现的开始`t`。 例如，如果目标是`abab`，读完一段文字后，我们只需要知道当前的后缀是否是`a`,`ab`， 或者`aba`。 之前的整个串联是无关紧要的。 

粗心的实现可能会在重叠匹配上失败。 例如，如果目标是`aaa`所选文本是`aaaa`，正确的输出是`2`，因为出现的位置为 1 到 3 和 2 到 4。在找到出现的情况后跳过匹配字符的解决方案只会计数`1`。 

另一个棘手的情况是当某个事件跨越两个选定字符串之间的边界时。 考虑目标`abc`和数据字符串`ab`和`c`。 选择两个字符串即可进行串联`abc`，所以答案是`1`。 单独计算每个字符串内出现次数的方法会错误地输出`0`。 

最后一个边缘情况是不选择任何字符串。 如果每个数据串都无用，则答案必须保留`0`。 例如，与目标`xyz`和一个数据串`aaaa`，正确的输出是`0`。 

## 方法

 直接的方法是尝试数据点的每个可能的子集。 对于每个子集，我们连接所选的字符串并计算出现的次数`t`。 这是正确的，因为每个有效的最终文档都对应于一个子集。 问题是子集的数量，可以是`2^1000`，所以这种做法远远超出了我们的处理能力。 

关键的观察是未来并不依赖于完全串联。 当我们从左到右处理字符串时，我们只需要描述当前文本的最长后缀的自动机状态，该后缀也是`t`。 这与基于前缀函数的字符串匹配所使用的状态信息相同。 

由于目标长度最多为 20，因此只有少量可能的状态。 对于每个数据字符串，我们可以预先计算如果我们从每个可能的状态开始附加它会发生什么。 转换告诉我们新的状态以及有多少新的发生`t`被创建。 

那么问题就变成了一个简单的动态规划过程。 在扫描数据点时，`dp[state]`存储考虑处理后的字符串并以该自动机状态结束后可实现的最大匹配数。 对于每个新字符串，我们要么跳过它，要么接受它并应用其预先计算的转换。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n * 总长度) | O（总长度）| 太慢了 |
 | 最佳 | O(n * | t | * ( |

 ## 算法演练

 1. 为目标字符串构建基于前缀函数的自动机。 对于每个可能的状态，存储读取字符后的下一个状态以及该字符是否完成出现。 状态表示目标当前有多少个字符与我们已读取的后缀匹配。 
2. 对于每个数据字符串，从每个可能的状态开始模拟将其添加到当前文本。 存储结果状态和创建的事件数。 这是可行的，因为目标很短，因此预先计算所有转换的成本很低。 
3.用状态初始化动态规划数组`0`有价值`0`。 这代表一个空的选择串联。 
4. 按顺序处理数据串。 对于每个字符串，首先复制当前 DP 值作为我们跳过该字符串的选项。 
5. 对于每个当前自动机状态，尝试获取当前字符串。 移动到预先计算的下一个状态并添加该字符串产生的匹配数。 保持该状态的最佳值。 
6. 处理完所有字符串后，答案是所有自动机状态中的最大值，因为最终的后缀状态并不重要。 

为什么它有效：DP 不变量是在处理完第一个`i`数据字符串，`dp[s]`是使匹配器处于状态的那些字符串的所有选择中可能出现的最佳次数`s`。 跳过字符串会保持相同的状态和分数，而获取字符串则使用附加字符串的确切效果。 由于每个可能的选择都是采用或跳过下一个字符串，因此会考虑所有有效的串联。 自动机状态准确地包含了未来扩展所需的信息，因此不会丢失任何必要的信息。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    target = input().strip()
    n = int(input())
    strings = [input().strip() for _ in range(n)]

    m = len(target)

    pi = [0] * m
    for i in range(1, m):
        j = pi[i - 1]
        while j > 0 and target[i] != target[j]:
            j = pi[j - 1]
        if target[i] == target[j]:
            j += 1
        pi[i] = j

    nxt = [[0] * 26 for _ in range(m)]
    add = [[0] * 26 for _ in range(m)]

    for state in range(m):
        for c in range(26):
            ch = chr(ord('a') + c)
            j = state
            while j > 0 and target[j] != ch:
                j = pi[j - 1]
            if target[j] == ch:
                j += 1
            if j == m:
                add[state][c] = 1
                j = pi[m - 1]
            nxt[state][c] = j

    transitions = []
    for s in strings:
        cur = []
        for start in range(m):
            state = start
            score = 0
            for ch in s:
                idx = ord(ch) - ord('a')
                score += add[state][idx]
                state = nxt[state][idx]
            cur.append((state, score))
        transitions.append(cur)

    dp = [-10**9] * m
    dp[0] = 0

    for trans in transitions:
        ndp = dp[:]
        for state in range(m):
            if dp[state] < 0:
                continue
            to, gain = trans[state]
            if dp[state] + gain > ndp[to]:
                ndp[to] = dp[state] + gain
        dp = ndp

    print(max(dp))

if __name__ == "__main__":
    solve()
```前缀函数构建在不匹配后继续匹配所需的失败链接。 这可以避免在字符不适合时重新扫描整个目标。 

这`nxt`和`add`表格描述了自动机。`nxt[state][character]`是读取字符后的后缀状态，而`add[state][character]`告诉该角色是否完成了一次事件。 当发现某个事件时，状态会回退到最长的正确后缀，该后缀也是前缀，这就是允许重叠的原因。 

每个数据串的转换表被计算一次。 模拟使用自动机而不是重复搜索目标，因此即使很长的数据字符串也可以快速处理。 

DP 更新首先复制当前数组，因为跳过字符串必须仍然是可能的。 然后每个状态都会尝试获取该字符串并更新结果状态。 Python中不存在整数溢出问题，但负的初始值代表不可能的状态。 

## 工作示例

 对于第一个样本：```
target = lol
strings:
olo
lol
olo
```DP的演变为：

 | 数据处理| 加工后的最佳状态| 最高分 |
 | ---| ---| ---|
 | 无 | 状态 0: 0 | 0 |
 | 奥洛 | 还没有完整匹配 | 0 |
 | 哈哈| 接受它就创造了一场比赛 | 1 |
 | 奥洛 | 跨越先前的边界会产生更多匹配 | 3 |

 该跟踪说明了为什么保持后缀状态很重要。 最后一个字符串不包含`lol`单独，但由于之前选择的文本，它完成了匹配。 

对于第二个样本：```
target = ababac
strings:
abab
aba
abac
```| 数据处理| 最佳选择| 分数 |
 | ---| ---| ---|
 | 无 | 空 | 0 |
 | 阿巴 | 取第一个字符串 | 0 |
 | 阿坝| 跳过或接受，没有完成的目标 | 0 |
 | 巴巴克 | 合并第一个和最后一个 | 1 |

 这表明 DP 在保留原始顺序的同时处理获取和跳过字符串之间的选择。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * m * (m + L)) | O(n * m * (m + L)) | 每个`n`字符串是从每个目标状态模拟的，其中`m`是目标长度并且`L`是字符串长度。 |
 | 空间| O(米) | DP 对于每个自动机状态仅存储一个值。 |

 这里`m`最多为 20，因此状态空间很小。 处理后的文本总长度最多约为 100000 个字符，使得这种方法足够快。 

## 测试用例```python
import sys
import io

def solve(inp):
    old = sys.stdin
    sys.stdin = io.StringIO(inp)

    target = sys.stdin.readline().strip()
    n = int(sys.stdin.readline())
    strings = [sys.stdin.readline().strip() for _ in range(n)]

    m = len(target)

    pi = [0] * m
    for i in range(1, m):
        j = pi[i - 1]
        while j > 0 and target[i] != target[j]:
            j = pi[j - 1]
        if target[i] == target[j]:
            j += 1
        pi[i] = j

    nxt = [[0] * 26 for _ in range(m)]
    add = [[0] * 26 for _ in range(m)]

    for s in range(m):
        for c in range(26):
            ch = chr(97 + c)
            j = s
            while j > 0 and target[j] != ch:
                j = pi[j - 1]
            if target[j] == ch:
                j += 1
            if j == m:
                add[s][c] = 1
                j = pi[m - 1]
            nxt[s][c] = j

    dp = [0] + [-10**9] * (m - 1)

    for text in strings:
        trans = []
        for start in range(m):
            state = start
            score = 0
            for ch in text:
                x = ord(ch) - 97
                score += add[state][x]
                state = nxt[state][x]
            trans.append((state, score))

        ndp = dp[:]
        for i in range(m):
            if dp[i] >= 0:
                j, gain = trans[i]
                ndp[j] = max(ndp[j], dp[i] + gain)
        dp = ndp

    sys.stdin = old
    return str(max(dp)) + "\n"

assert solve("""lol
3
olo
lol
olo
""") == "3\n"

assert solve("""ababac
3
abab
aba
abac
""") == "1\n"

assert solve("""aaa
1
aaaa
""") == "2\n"

assert solve("""abc
2
ab
c
""") == "1\n"

assert solve("""xyz
1
aaaa
""") == "0\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`lol`三个字符串 |`3`| 重叠和边界匹配 |
 |`ababac`样品|`1`| 按顺序选择子集 |
 |`aaa`和`aaaa`|`2`| 重叠出现 |
 |`abc`和`ab`,`c`|`1`| 跨字符串边界匹配 |
 |`xyz`和`aaaa`|`0`| 没有有用的数据点 |

 ## 边缘情况

 对于目标`aaa`和字符串`aaaa`，自动机在状态下启动`0`。 读取前三个字符后，它发现一个出现并回退到状态`2`, 代表后缀`aa`。 读取第四个字符会产生另一个事件。 算法输出`2`因为它在匹配后永远不会丢弃后缀。 

对于目标`abc`和字符串`ab`和`c`，第一个选择的字符串使自动机处于状态`2`，意味着当前后缀是`ab`。 当第二个字符串开头时`c`，自动机立即完成模式并给分数加一。 这处理跨越多个选定字符串的匹配。 

对于目标`xyz`和字符串`aaaa`，每次转换都远离已完成的比赛。 DP 将可获得的最佳分数保持为`0`，代表没有选择任何有用的东西。 该算法从不强制选择字符串，因此不可能的贡献不会影响结果。
