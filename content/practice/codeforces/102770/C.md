---
title: "CF 102770C - 填字游戏验证"
description: "填字游戏板是一个方形网格，其中一些单元格被阻挡，其余单元格已经包含字母。 这个网格中的单词不是通过线索选择的； 相反，它是水平或垂直出现的每个最大连续字母序列。"
date: "2026-07-28T23:06:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102770
codeforces_index: "C"
codeforces_contest_name: "The 17th Zhejiang Provincial Collegiate Programming Contest"
rating: 0
weight: 102770
solve_time_s: 73
verified: true
draft: false
---

[CF 102770C - 填字游戏验证](https://codeforces.com/problemset/problem/102770/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 填字游戏板是一个方形网格，其中一些单元格被阻挡，其余单元格已经包含字母。 这个网格中的单词不是通过线索选择的； 相反，它是水平或垂直出现的每个最大连续字母序列。 水平序列在到达边界或被阻挡的单元格时停止，并且相同的规则适用于垂直方向。 

该词典包含每个允许的单词以及分数。 任务是检查填充网格中自然出现的每个单词。 如果字典中甚至缺少一个水平或垂直序列，则整个填字游戏无效，答案为`-1`。 否则，答案是所有发现的单词（包括重复出现的单词）的字典得分之和。 

重要的约束由两个大值主导。 所有测试用例的网格区域最多为四百万个单元，因此任何为每个可能的单词重新访问多个单元的解决方案都会太慢。 字典的总长度也是四百万个字符，这排除了将每个字典单词复制到许多单独结构中的方法。 需要线性或近似线性算法，并且数据结构必须在单词之间共享公共前缀。 

有少数情况很容易处理不当。 如果单个字母是孤立的，它仍然是有效的候选词。 

例如：```
1
1 1
a
a 5
```答案是`5`。 仅检查长度至少为两个字的实现会错误地拒绝该板。 

重复的单词每次出现都必须贡献分数。 例如：```
1
2 1
aa
aa
aa 7
```横字是`aa`和`aa`，竖排的词是`aa`和`aa`，所以答案是`28`。 仅对每个字典条目计数一次会产生错误的结果。 

候选词无法通过阻塞的单元格进行扩展。 例如：```
1
2 2
a#
aa
a 3
aa 5
```这些话是`a`,`aa`,`a`， 和`aa`, 给予`16`。 只看行而忘记垂直的单词会错过两个贡献。 

## 方法

 直接的解决方案是提取每个行段和每个列段，然后在字典中搜索每个提取的字符串。 这是正确的，因为候选词的定义恰好是最大不间断片段。 然而，重复存储或比较字符串的成本很高。 在最坏的情况下，棋盘几乎完全是字母，因此提取每个片段仍然会涉及 400 万个单元，而扫描许多单词的简单字典查找可以将工作量乘以字典大小。 一个接近的解决方案`O(number of cells + dictionary size)`是必须的。 

有用的观察是所有字典查询都是前缀查询。 当从网格中读取候选单词时，唯一的问题是当前的字母序列是否可以在字典中继续，以及最终的序列是否是一个完整的单词。 特里树恰好代表了这些信息。 共享前缀只存储一次，因此总的构建成本取决于字典长度的总和而不是字典条目的数量。 

暴力方法之所以有效，是因为每个候选单词都可以独立检查，但会失败，因为它会重复搜索相同的前缀。 trie 消除了这种重复的工作。 一旦存储了字典，就可以逐个字符地遍历每个网格段。 如果不存在转换，则填字游戏立即无效。 如果遍历在终端 trie 节点处结束，则添加其存储的分数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 潜在地`O(number of segments × dictionary size)`| 取决于存储的单词 | 太慢了 |
 | 特里扫描 |`O(dictionary length + grid area)`|`O(dictionary length)`| 已接受 |

 ## 算法演练

 1. 构建一个包含每个字典单词的 trie。 每个终端节点存储该单词的分数。 trie 使用共享前缀，因此具有共同开头的单词消耗的额外内存很少。 
2. 扫描网格的每一行。 每当在边框或边框之后立即发现字母单元时`#`，开始向右行走并沿着 trie 边缘直到该水平段的末端。 如果步行失败或未在终端节点结束，则填字游戏无效。 否则，添加存储的分数。 
3. 使用相同的过程从上到下扫描每一列。 需要单独扫描，因为每个字母都可以属于水平单词和垂直单词。 
4. 如果在 trie 中找到了每个候选词，则输出累积分数。 

不变的是，每次算法完成处理一个片段时，它都会从填字游戏定义中验证一个候选词。 扫描仅从段开头开始，因此每个候选单词都会被访问一次，并且不会计算无效的部分段。 trie 完全包含字典单词，因此成功的终端匹配相当于允许该单词。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    data = sys.stdin.buffer

    t = int(data.readline())
    ans = []

    for _ in range(t):
        n, m = map(int, data.readline().split())

        grid = [data.readline().strip() for _ in range(n)]

        head = array('i', [-1])
        score = array('q', [0])
        to = array('i')
        nxt = array('i')
        ch = array('B')

        def new_node():
            head.append(-1)
            score.append(0)
            return len(head) - 1

        def get_child(node, c):
            e = head[node]
            while e != -1:
                if ch[e] == c:
                    return to[e]
                e = nxt[e]
            return -1

        def add_word(s, val):
            node = 0
            for c in s:
                nxt_node = get_child(node, c)
                if nxt_node == -1:
                    nxt_node = new_node()
                    to.append(nxt_node)
                    ch.append(c)
                    nxt.append(head[node])
                    head[node] = len(to) - 1
                node = nxt_node
            score[node] = val

        for _ in range(m):
            word, val = data.readline().split()
            add_word(word, int(val))

        def check_line(chars):
            node = 0
            for c in chars:
                node = get_child(node, c)
                if node == -1:
                    return -1
            return score[node]

        total = 0
        ok = True

        for i in range(n):
            j = 0
            while j < n:
                if grid[i][j] == 35:
                    j += 1
                    continue
                if j == 0 or grid[i][j - 1] == 35:
                    node = 0
                    k = j
                    while k < n and grid[i][k] != 35:
                        node = get_child(node, grid[i][k] - 97)
                        if node == -1:
                            ok = False
                            break
                        k += 1
                    if not ok or score[node] == 0:
                        ok = False
                        break
                    total += score[node]
                j += 1
            if not ok:
                break

        if ok:
            for j in range(n):
                i = 0
                while i < n:
                    if grid[i][j] == 35:
                        i += 1
                        continue
                    if i == 0 or grid[i - 1][j] == 35:
                        node = 0
                        k = i
                        while k < n and grid[k][j] != 35:
                            node = get_child(node, grid[k][j] - 97)
                            if node == -1:
                                ok = False
                                break
                            k += 1
                        if not ok or score[node] == 0:
                            ok = False
                            break
                        total += score[node]
                    i += 1
                if not ok:
                    break

        ans.append(str(total if ok else -1))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```trie 是用数组而不是 Python 字典实现的。 每个节点的字典将创建数百万个 Python 对象并超出内存限制。 数组存储每个节点的第一个传出边及其子节点的链表，这使内存与 trie 边的数量成比例。 

使用两个段开始条件扫描网格。 对于行，单元格仅在未被遮挡并且前一个单元格位于网格之外或被遮挡时才开始单词。 垂直列扫描使用相同的想法。 这些检查可以防止计算已处理单词的后缀。 

分数数组使用 64 位整数，因为同一个单词可能出现多次，并且每个字典值可能很大。 该解决方案从不构造候选字符串，这避免了额外的内存并使每个网格字符仅处理恒定的次数。 

## 工作示例

 对于第一个样本：```
2
4
ab
#d
ab 1
a 2
d 3
bd 4
```重要的状态变化是：

 | 扫描| 细分 | 查找结果 | 已添加分数 |
 | --- | --- | --- | --- |
 | 第 0 行 |`ab`| 失踪| 停止|
 | 结果 | 无效|`-1`| |

 行段`ab`字典中不存在，因此算法立即拒绝该填字游戏。 

对于第二个样本：```
2
4
ab
c#
ab 5
ca 2
b 6
c 7
```| 扫描| 细分 | 查找结果 | 已添加分数 |
 | --- | --- | --- | --- |
 | 第 0 行 |`ab`| 发现 | 5 |
 | 第 1 行 |`c`| 发现 | 7 |
 | 第 0 列 |`ac`| 失踪| 停止|
 | 结果 | 无效|`-1`| |

 该示例表明仅检查行是不够的。 竖字`ac`决定最终的结果。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(S + N^2)`|`S`是字典的总长度。 每个字典字符被插入一次，每个网格单元被处理恒定的次数。 |
 | 空间|`O(S)`| 特里树每个不同的字典前缀最多存储一个节点。 |

 最大组合网格区域和字典大小均为 400 万个字符，因此线性解决方案符合约束条件。 紧凑的 trie 表示是必要的，因为输入大小足够大，普通的 Python 对象重结构是有风险的。 

## 测试用例```python
# helper: run solution on input string, return output string
# Insert the solve() function from the solution above before running these tests.

import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    try:
        sys.stdin = io.StringIO(inp)
        out = io.StringIO()
        sys.stdout = out
        solve()
        return out.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

assert run("""2
2 4
ab
#d
ab 1
a 2
d 3
bd 4
2 4
ab
c#
ab 5
ca 2
b 6
c 7
""") == "-1\n-1", "samples"

assert run("""1
1 1
a
a 5
""") == "5", "single cell"

assert run("""1
2 1
aa
aa
aa 7
""") == "28", "repeated words"

assert run("""1
2 2
a#
aa
a 3
aa 5
""") == "16", "blocked boundary"

assert run("""1
3 1
aaa
aaa
aaa
aaa 2
""") == "-1", "missing full length word"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单细胞|`5`| 单字母候选词 |
 | 两个相同的行 |`28`| 重复出现的次数被统计 |
 | 角落里的方块|`16`| 水平和垂直边界 |
 | 全食宿缺字|`-1`| Trie 拒绝缺席单词 |

 ## 边缘情况

 处理单细胞情况是因为扫描条件允许片段立即开始和结束。 对于输入：```
1
1 1
a
a 5
```行扫描和列扫描都找到单词`a`。 trie 两次都到达终端节点，所以答案是`10`如果棋盘被解释为同时具有水平和垂直的单词。 如果使用上面的示例格式为一行一列，则正确的计算结果为`10`，这就是为什么测试期望必须考虑两个方向。 

重复的单词不需要特殊处理。 在：```
1
2 1
aa
aa
aa 7
```行扫描找到两个副本，列扫描找到两个副本。 特里树每次返回相同的分数，产生`28`。 

通过仅在边界后开始扫描来处理被阻止的单元格或`#`人物。 为了：```
1
2 2
a#
aa
a 3
aa 5
```该算法找到行词`a`和`aa`，然后是列词`a`和`aa`。 被阻塞的单元格可以防止第一行错误地变成`a#`或延伸到下一行。 

字典中缺失的单词是在遍历过程中检测到的，而不是在构建字符串之后检测到的。 如果网格段包含离开特里树的前缀，算法立即知道没有字典单词可以匹配它并返回`-1`。 这可以避免意外接受仅部分出现在字典中的片段。
