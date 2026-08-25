---
title: "CF 104790D - 民主命名"
description: "新县的每个城市都有一个相同长度的名称。 县的最终名称一次选择一个字符。 对于每个位置，每个城市都会投票给以自己名字出现在该位置的字母。"
date: "2026-06-28T16:41:29+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104790
codeforces_index: "D"
codeforces_contest_name: "2023 Benelux Algorithm Programming Contest (BAPC 23)"
rating: 0
weight: 104790
solve_time_s: 75
verified: true
draft: false
---

[CF 104790D - 民主命名](https://codeforces.com/problemset/problem/104790/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 新县的每个城市都有一个相同长度的名称。 县的最终名称一次选择一个字符。 对于每个位置，每个城市都会投票给以自己名字出现在该位置的字母。 得票数最高的字母成为县名对应的字母。 如果几个字母获得相同的最高票数，则选择按字母顺序排列最小的字母。 

输入包括城市数量、每个城市名称的公共长度以及名称本身。 所需的输出是通过在每个字符位置独立应用投票规则而产生的单个名称。 

限制相当小。 城市名称最多 1000 个，每个城市名称最多 1000 个字符。 这意味着总共最多有一百万个输入字符。 任何处理每个字符一次或恒定次数的算法都很容易符合典型的竞赛限制。 重复重新扫描所有字符串以查找每个可能答案的算法在这里仍然可以接受，但是当存在直接计数解决方案时，没有理由做额外的工作。 

第一个不明显的边缘情况是多个字母之间的联系。 考虑输入```
2 1
b
a
```两个字母都获得一票，所以正确的输出是```
a
```如果粗心的实现只是保留遇到的第一个最大值，则会错误地输出`b`。 

另一种情况是每个城市都有相同的名称。 例如，```
3 4
code
code
code
```答案一定是```
code
```由于每个立场都有一致同意，因此任何打破平局的逻辑都不应干扰。 

最后一种情况是每个位置都有不同的获胜者。 例如，```
3 3
abc
bbc
cac
```输出是```
abc
```每列必须独立处理。 结合不同立场的信息会产生错误的结果。 

## 方法

 最直接的解决办法就是对每个位置单独处理。 对于一列，计算每个字母在所有城市名称中出现的次数，然后选择出现频率最高的字母。 如果几个字母出现频率相同，则选择字母顺序最小的一个。 对所有位置重复此操作会产生所需的答案。 

这种方法已经对每个输入字符仅执行一次传递。 由于最多有 100 万个字符，因此总工作量约为 100 万次计数运算，加上检查每个位置的 26 个小写字母。 这很容易足够快。 

关键的观察是每个角色位置完全独立于其他位置。 第一个字母的决定永远不会影响第二个字母的决定。 由于字母表仅包含 26 个小写字母，因此为每列维护大小为 26 的频率数组既简单又高效。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 |---|---:|---:|---|
 | 蛮力 | O(n × m × 26) | O(26) | 已接受 |
 | 最佳| O(n × m + 26 × m) | O(26) | 已接受 |

 尽管由于字母表大小是恒定的，两行基本上具有相同的渐近复杂度，但频率计数公式是自然且预期的解决方案。 

## 算法演练

 1. 读取值`n`和`m`，然后存储所有城市名称。 

2. 创建一个空列表，其中将包含最终县名称的字符。 

3. 对于每个角色位置`0`到`m - 1`，创建一个长度为 26 且初始化为零的频率数组。 

4. 访问每个城市名称并增加当前位置出现的字母对应的计数器。 

每个城市都向当前列贡献一票，因此在这一轮之后，频率数组包含该位置的完整选举结果。 

5. 按字母顺序扫描 26 个计数器，并跟踪出现频率最高的字母。 

因为扫描是从`'a'`到`'z'`，仅当发现严格更大的频率时才更新答案，每当频率绑定时，自动保留按字母顺序排列的最小字母。 

6. 将选定的字母附加到答案中。 

7. 处理完所有位置后，将收集到的字母连接成字符串并打印。 

### 为什么它有效

 对于每个位置，该算法都会准确计算每个可能的字母收到的票数。 这些计数完全符合选举的定义。 选择数量最多的字母可以满足多数规则，并且按字母顺序扫描字母可以保证解决平局问题，有利于最小的字母。 由于每个位置都是独立处理的，因此构造的名称的每个字符都是正确的，从而使整个输出正确。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
names = [input().strip() for _ in range(n)]

answer = []

for col in range(m):
    freq = [0] * 26

    for name in names:
        freq[ord(name[col]) - ord('a')] += 1

    best = 0
    for i in range(1, 26):
        if freq[i] > freq[best]:
            best = i

    answer.append(chr(best + ord('a')))

print("".join(answer))
```该程序首先读取所有城市名称，以便可以有效地访问每一列。 

对于每一列，它都会创建一个新的频率数组，其中每个小写字母都有一个条目。 每个城市通过增加适当的计数器来贡献一票。 

变量`best`存储当前获胜字母的索引。 扫描开始于`'a'`作为最初的候选人。 比较使用`>`而不是`>=`。 这个细节就是实施打破平局规则的东西。 当两个字母具有相同的频率时，字母表中较早的一个字母将保持选中状态，因为它是最先遇到的。 

最后，所选字母被转换回字符，收集在列表中，并加入到最终的县名中。 

## 工作示例

 ### 示例 1

 输入```
3 5
apple
maple
alpha
```| 职位| 信件| 获奖信| 到目前为止的答案 |
 |---:|---|---|---|
 | 0 | 一个，米，一个| 一个 | 一个 |
 | 1 | p、a、l | 一个 | 啊|
 | 2 | ， ， ， | | p| AA |
 | 3 | 左，左，高 | 我| AAPL |
 | 4 | 电子，电子，a | 电子| 阿普勒 |

 最终的答案是`aaple`。 第二列展示了打破平局的规则。 字母`a`,`l`， 和`p`每个出现一次，所以最小的字母，`a`，被选择。 

### 示例 2

 输入```
3 4
icpc
back
laps
```| 职位| 信件| 获奖信| 到目前为止的答案 |
 |---:|---|---|---|
 | 0 | 我，b，l | 乙| 乙|
 | 1 | c、a、a | 一个 | 巴|
 | 2 | p、c、p| p| 巴普|
 | 3 | c、k、s | c | 巴普克|

 最终的答案是`bapc`。 每列都是独立处理的，确认早期的决策不会影响后来的决策。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 |---|---:|---|
 | 时间 | O(n × m + 26 × m) | 每个输入字符都会被计数一次，然后每列检查 26 个计数器。 |
 | 空间| O(26) | 除了输入之外，只需要一个固定大小的频率数组。 |

 处理的字符总数最多为一百万个，每个字符只处理一次。 每列超过 26 个字母的额外扫描可以忽略不计。 该算法非常适合问题的约束。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    n, m = map(int, input().split())
    names = [input().strip() for _ in range(n)]

    ans = []

    for col in range(m):
        freq = [0] * 26
        for name in names:
            freq[ord(name[col]) - ord('a')] += 1

        best = 0
        for i in range(1, 26):
            if freq[i] > freq[best]:
                best = i

        ans.append(chr(best + ord('a')))

    print("".join(ans))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided samples
assert run("3 5\napple\nmaple\nalpha\n") == "aaple\n", "sample 1"
assert run("3 4\nicpc\nback\nlaps\n") == "bapc\n", "sample 2"

# minimum size
assert run("1 1\nz\n") == "z\n", "single city"

# tie breaking
assert run("2 1\nb\na\n") == "a\n", "alphabetical tie"

# all equal
assert run("3 3\ncat\ncat\ncat\n") == "cat\n", "identical names"

# different winners per column
assert run("3 3\nabc\nbbc\ncac\n") == "abc\n", "independent columns"
```| 测试输入| 预期产出 | 它验证了什么 |
 |---|---|---|
 | 一城一信|`z`| 最小输入尺寸 |
 | 两个名字`b`和`a`|`a`| 按字母顺序决胜 |
 | 三个相同的名字| 同名 | 一致投票 |
 |`abc`,`bbc`,`cac`|`abc`| 每列独立处理|

 ## 边缘情况

 考虑打破平局的例子。```
2 1
b
a
```唯一列的频率数组变为`[1, 1, 0, ..., 0]`。 扫描开始于`'a'`作为当前的获胜者。 什么时候`'b'`经检验，其频率相等而不是更大，因此获胜者没有改变。 输出正确`a`。 

现在考虑一致投票。```
3 4
code
code
code
```每列仅包含一个不同的字母。 每个频率数组都有一个最大值，因此选定的字母是`c`,`o`,`d`， 和`e`。 算法输出`code`完全符合预期。 

最后，考虑不同列中的不同获胜者。```
3 3
abc
bbc
cac
```第一列有频率`{a:1, b:1, c:1}`， 所以`a`按字母顺序获胜。 第二列有`b`出现两次，最终获胜。 第三列有`c`每个名字都一致。 该算法从不混合列之间的信息，从而产生正确的答案`abc`。
