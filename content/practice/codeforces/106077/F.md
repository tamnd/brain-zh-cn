---
title: "CF 106077F - 土星"
description: "我们得到一个目标字符串 t ，它代表 Shani 想要证明的主张。 她有一系列记录的数据字符串。 她可以选择这些字符串的任何子集，但所选字符串在连接时必须保持其原始顺序。"
date: "2026-06-25T12:11:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106077
codeforces_index: "F"
codeforces_contest_name: "UTPC Contest 9-17-25 Div. 2 (Beginner)"
rating: 0
weight: 106077
solve_time_s: 46
verified: true
draft: false
---

[CF 106077F - 土星](https://codeforces.com/problemset/problem/106077/F)

 **评级：** -
 **标签：** -
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定了一个目标字符串`t`这代表了沙尼想要证明的主张。 她有一系列记录的数据字符串。 她可以选择这些字符串的任何子集，但所选字符串在连接时必须保持其原始顺序。 然后，委员会搜索每一次出现的情况`t`在最终的串联文本中，包括重叠的出现次数，Shani 希望最大化该计数。 

输入包含目标模式，后跟可用字符串的数量和字符串本身。 输出是选择最佳字符串子序列后目标模式可以出现的最大可能次数。 

关键约束决定了解决方案。 最多有 1000 个数据串，每个数据串的长度最多为 100，而目标长度最多为 20。解决方案`O(n^2)`可能会传递字符串的数量，但实际的挑战是处理连接字符串的效果。 我们需要避免存储整个先前的串联，因为它的长度可以达到 100000。较小的目标长度表明只有与目标模式相关的信息才重要。 

边缘情况来自跨越所选字符串边界的匹配。 独立计算每个字符串内的匹配项的解决方案将会失败。 例如：```
Input
abc
2
a
bc
```正确的输出是：```
1
```选择两个字符串都会创建`abc`，其中匹配使用第一个字符串的结尾和第二个字符串的开头。 仅单独扫描每个字符串的方法将不会出现任何情况。 

另一个棘手的情况是重叠匹配。 考虑：```
Input
aa
1
aaa
```正确的输出是：```
2
```匹配的是位置 1 到 2 和 2 到 3。如果不小心实现，移动超过匹配的文本而不是允许重叠，则只会计算 1。 

## 方法

 最简单的方法是尝试每个可能的字符串子集，连接所选的子集，并计算模式的出现次数。 这是正确的，因为每个有效的最终文本恰好对应一个子集。 但是，字符串最多有 1000 个，因此有`2^1000`可能的子集。 甚至产生候选人也是不可能的。 

下一个观察结果是，未来并不取决于整个串联。 当我们附加另一个字符串时，唯一可以影响新出现的先前字符`t`是当前文本的后缀，可以成为前缀`t`。 这正是字符串匹配自动机维护的信息。 

我们可以构建一个 KMP 自动机`t`。 状态表示已处理文本的最长后缀的长度，该后缀也是以下前缀`t`。 每当我们添加一个字符时，自动机就会进入一个新状态并告诉我们是否创建了完整匹配。 由于模式长度最多为 20，因此状态数很少。 

对于每个数据字符串，我们可以预先计算它对每个自动机状态的影响。 如果我们包含该字符串，我们将获得一定数量的匹配并转移到另一个状态。 如果我们跳过它，状态和分数保持不变。 这将问题转化为字符串和自动机状态的动态规划。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n * 总长度) | O（总长度）| 太慢了 |
 | 最佳 | O(n * | t | * 字符串总长度) |

 ## 算法演练

 1. 为目标字符串构建KMP前缀函数。 前缀函数可以让我们在读取一个字符后快速找到下一个自动机状态。 

状态仅存储目标的多少部分已作为后缀进行匹配。 这已经足够了，因为任何未来的发生都只能依赖于这个后缀信息。 
2. 为每个数据串创建一个转换表。 对于每个可能的开始 KMP 状态，模拟读取整个字符串并记录结束状态以及模拟过程中目标出现的次数。 

这样做一次可以防止我们在动态编程期间重复扫描同一字符串。 
3. 初始化动态编程数组。`dp[state]`存储处理数据列表的某些前缀并以该自动机状态结束后可实现的最大匹配数。 

在选择任何字符串之前，自动机处于状态零且得分为零。 
4. 对数据串进行一一处理。 对于每个字符串，复制当前 DP 值，因为始终允许跳过该字符串。 然后尝试从之前的每个状态获取字符串，应用预先计算的转换并添加获得的匹配项。 

此步骤精确考虑每个字符串的两个选择：忽略它或附加它。 
5. 答案是所有最终状态中的最大值。 结束自动机状态并不重要，因为没有添加更多字符。 

不变量是在处理完第一个之后`i`字符串，每个`dp[state]`表示使自动机处于该状态的那些字符串的所有选择中的最佳可能分数。 跳过会保留现有的有效可能性，而获取字符串会考虑每个可能的先前状态并应用附加它的确切效果。 由于这是仅有的两个可能的操作，因此该不变量适用于每个已处理的字符串。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = input().strip()
    n = int(input())
    s = [input().strip() for _ in range(n)]

    m = len(t)

    pi = [0] * m
    for i in range(1, m):
        j = pi[i - 1]
        while j > 0 and t[i] != t[j]:
            j = pi[j - 1]
        if t[i] == t[j]:
            j += 1
        pi[i] = j

    def advance(state, ch):
        while state > 0 and t[state] != ch:
            state = pi[state - 1]
        if t[state] == ch:
            state += 1
        if state == m:
            return pi[m - 1], 1
        return state, 0

    trans = []
    for word in s:
        cur = []
        for start in range(m):
            state = start
            gain = 0
            for ch in word:
                state, add = advance(state, ch)
                gain += add
            cur.append((state, gain))
        trans.append(cur)

    dp = [-10**9] * m
    dp[0] = 0

    for word_id in range(n):
        ndp = dp[:]
        for state in range(m):
            if dp[state] < 0:
                continue
            nxt, gain = trans[word_id][state]
            if dp[state] + gain > ndp[nxt]:
                ndp[nxt] = dp[state] + gain
        dp = ndp

    print(max(dp))

if __name__ == "__main__":
    solve()
```前缀函数构造是通常的KMP预处理。 它可以让自动机从不匹配中恢复，而无需重新扫描已处理的文本。 

这`advance`函数处理一个字符。 如果完全匹配完成，自动机将返回到模式的最长边界而不是状态零。 这就是可以正确计算重叠匹配的原因。 

转换表存储来自每个可能状态的每个字符串的效果。 状态数最多为 20 个，因此与在 DP 内部重复扫描字符串相比，预先计算它的成本较低。 

DP 更新使用复制的数组，因为每个字符串都可以被跳过。 从旧数组中读取字符串并将其写入新数组，避免多次意外重复使用同一字符串。 使用最终最大值是因为任何后缀状态都是可接受的。 

## 工作示例

 对于第一个样本：```
t = lol

strings:
olo
lol
olo
```踪迹是：

 | 处理后的字符串 | 当前最佳状态| 最高分 |
 | ---| ---| ---|
 | 无 | 状态 0: 0 | 0 |
 | 奥洛 | 状态 3：1 | 1 |
 | 奥洛，哈哈| 状态 3: 2 | 2 |
 | 所有三个 | 状态 3: 3 | 3 |

 自动机保留足够的后缀信息来识别`lol`当弦相互接触时形成。 

对于第二个样本：```
t = ababac

strings:
abab
aba
abac
```踪迹是：

 | 处理后的字符串 | 行动| 分数 |
 | ---| ---| ---|
 | 无 | 空文本 | 0 |
 | 阿巴 | 取第一个字符串 | 0 |
 | 阿巴 + 阿巴 | 取第二个字符串 | 0 |
 | abab + aba + abac | 取第三根弦| 1 |

 最好的选择是将第一弦和第三弦连接起来。 该表显示 DP 不会贪婪地获取字符串，它保留所有可能的自动机状态。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * m * L) | 每个字符串都是从每个 KMP 状态模拟的，其中`m`是模式长度，`L`是最大字符串长度。 |
 | 空间| O(m^2 + m) | O(m^2 + m) | 转换表有`n * m`实现中的条目，而DP本身只需要`m`州。 |

 和`m <= 20`，自动机非常小。 尽管字符串数量为 1000，但每次转换模拟只涉及约 2000 个字符，这很容易在限制之内。 

## 测试用例```python
import sys, io

def solve_case(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    t = input().strip()
    n = int(input())
    s = [input().strip() for _ in range(n)]

    m = len(t)

    pi = [0] * m
    for i in range(1, m):
        j = pi[i - 1]
        while j > 0 and t[i] != t[j]:
            j = pi[j - 1]
        if t[i] == t[j]:
            j += 1
        pi[i] = j

    def advance(state, ch):
        while state > 0 and t[state] != ch:
            state = pi[state - 1]
        if t[state] == ch:
            state += 1
        if state == m:
            return pi[m - 1], 1
        return state, 0

    trans = []
    for word in s:
        cur = []
        for start in range(m):
            state = start
            gain = 0
            for ch in word:
                state, add = advance(state, ch)
                gain += add
            cur.append((state, gain))
        trans.append(cur)

    dp = [-10**9] * m
    dp[0] = 0

    for i in range(n):
        ndp = dp[:]
        for st in range(m):
            nxt, gain = trans[i][st]
            ndp[nxt] = max(ndp[nxt], dp[st] + gain)
        dp = ndp

    return str(max(dp)) + "\n"

assert solve_case("""lol
3
olo
lol
olo
""") == "3\n"

assert solve_case("""ababac
3
abab
aba
abac
""") == "1\n"

assert solve_case("""abc
2
a
bc
""") == "1\n"

assert solve_case("""aa
1
aaa
""") == "2\n"

assert solve_case("""x
4
x
x
a
x
""") == "3\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`abc`和`a`,`bc`|`1`| 跨越字符串边界的匹配 |
 |`aa`和`aaa`|`2`| 重叠匹配 |
 |`x`有几个字符串 |`3`| 重复的一个字符匹配 |
 | 案例案例| 示例输出 | 一般 DP 正确性 |

 ## 边缘情况

 对于跨越边界的情况：```
abc
2
a
bc
```DP首先处理`a`，使自动机处于表示匹配前缀的状态`a`。 什么时候`bc`被采取，自动机从该状态继续并完成`abc`，添加一场比赛。 

对于重叠匹配：```
aa
1
aaa
```第一个之后`a`，自动机会记住一个匹配的字符。 第二个`a`完成一场比赛，但它并没有完全重置，而是回到了边界`aa`，这是另一个`a`。 第三个`a`创建第二个匹配项。 

对于重复的相同字符串：```
x
4
x
x
a
x
```DP 可以选择第一弦、第二弦和第四弦。 每个选定的字符串都会添加一次出现。 跳过的字符串不会影响自动机状态，因此最终答案是 3。
