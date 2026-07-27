---
title: "CF 102824G - 宝石"
description: "我们有一个岩石集合，其中每块岩石都由一串小写字母描述。 字母代表岩石内部出现的矿物类型。"
date: "2026-07-26T22:39:51+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102824
codeforces_index: "G"
codeforces_contest_name: "mBIT Advanced November 2020"
rating: 0
weight: 102824
solve_time_s: 33
verified: true
draft: false
---

[CF 102824G - 宝石](https://codeforces.com/problemset/problem/102824/G)

 **评级：** -
 **标签：** -
 **求解时间：** 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个岩石集合，其中每块岩石都由一串小写字母描述。 字母代表岩石内部出现的矿物类型。 相同的矿物可以在一块岩石中出现多次，但要使一种矿物被视为宝石，它必须在每块岩石中至少出现一次。 

任务是计算有多少种不同的矿物类型满足这个条件。 输入给出了岩石的数量，后面是每块岩石的矿物描述。 输出是所有描述共有的小写字母的数量。 

主要限制是字母表是固定的：只有 26 种可能的矿物类型。 即使岩石的数量或描述的长度变大，可能的答案的数量仍然保持不变。 这意味着当简单的频率或存在跟踪方法就足够时，我们应该避免比较每对岩石或重复扫描所有字符。 取决于石头数量平方的解决方案将成为不必要的工作，而处理每个字符一次的解决方案很容易足够快。 

微妙的情况来自于在一块岩石中出现和在一块岩石中多次出现之间的区别。 例如，如果输入是：```
3
aaa
a
aa
```答案是：```
1
```矿物质`a`是宝石，因为它出现在所有三种岩石中。 粗心的解决方案是计算总出现次数而不是检查每块岩石中的存在情况，可能会过度计算。 

另一种极端情况是所有岩石都没有共享矿物。 例如：```
2
abc
def
```正确的输出是：```
0
```以所有字母开头且仅删除缺失字母的解决方案必须正确处理这种情况。 

最终的边界情况是一块岩石：```
1
xyz
```输出是：```
3
```唯一岩石中出现的每种矿物质都会自动出现在每块岩石中。 假设至少有两块岩石的解决方案可能会错误地返回零。 

## 方法

 直接的方法是检查每一种可能的矿物质，并测试它是否出现在每块岩石中。 由于只有 26 个字母，这已经比比较每对字符串要好得多了。 对于每个字母，我们扫描所有岩石，如果任何岩石不包含该字母，则将其标记为无效。 工作量与岩石数量乘以 26 成正比，加上检查每个字符串内成员资格的成本。 如果每次都通过搜索字符串来实现隶属度，则总工作量可达约`26 * n * m`， 在哪里`m`是岩石的平均长度。 

更自然的解决方案来自于字母表尺寸很小的事实。 我们不再反复询问岩石中是否存在字母，而是对每块岩石进行一次总结。 对于每块岩石，我们都会记录其中出现的一组字母。 然后我们将这些集合相交。 处理完所有岩石后，只有在每个交叉点中幸存下来的字母才是宝石。 

蛮力方法之所以有效，是因为可能的矿物类型只有几种，但它会多次重复相同的存在性检查。 关键的观察结果是，岩石只提供有关哪些字母出现的信息，而不提供它们出现次数的信息。 将每块岩石表示为一组当前字母可以消除不必要的重复工作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(26 * n * 米) | O(1) | O(1) | 接受小投入，但不必要的工作 |
 | 最佳 | O(所有字符串的总长度 + 26 * n) | O(26) | 已接受 |

 ## 算法演练

 1. 用全部 26 个小写字母初始化可能的宝石集。 一开始，每一种矿物质仍然存在于每块岩石中。 
2. 逐一阅读每块岩石，并构建该岩石中出现的一组字母。 重复出现相同的字母不会改变集合，因为只有存在才重要。 
3. 将当前候选集与当前岩石中找到的字母相交。 这块岩石上缺失的任何字母都不能成为宝石，因此必须将其移除。 
4. 处理完所有岩石后，数一下剩余的字母。 这些正是每块岩石中出现的矿物质。 

为什么它有效：

 维护的集合始终代表迄今为止处理的每块岩石中出现的矿物质。 最初，在看到任何岩石之前，所有字母都满足这个条件。 当处理新的岩石时，只有该岩石中存在的字母才能继续满足条件，因此交集运算保留了不变量。 在最后一块岩石之后，该集合完全包含所有岩石中存在的字母，这是宝石的定义。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n_line = input().strip()
    if not n_line:
        return
    n = int(n_line)

    common = set("abcdefghijklmnopqrstuvwxyz")

    for _ in range(n):
        rock = input().strip()
        common &= set(rock)

    print(len(common))

if __name__ == "__main__":
    solve()
```该解决方案首先创建包含每个小写字母的候选集。 这对应于尚未检查任何岩石的初始状态。 

对于每块岩石，`set(rock)`将描述转换为至少出现一次的矿物集合。 这会自动删除重复出现的情况，这正是该问题所需的信息。 交叉点操作员仅保留已经可能存在且也存在于当前岩石中的矿物。 

最终尺寸为`common`就是答案。 不存在索引问题，因为该算法直接处理字符值。 整数溢出不是问题，因为打印的最大值仅为 26。 

## 工作示例

 考虑输入：```
3
abcdde
baccd
eeabg
```踪迹是：

 | 步骤| 当前的摇滚| 岩石中的字母| 剩余宝石 |
 | ---| ---| ---| ---|
 | 开始| 无 | 所有字母| abcdefghijklmnopqrstuvwxyz |
 | 1 | abcdde | ABCDE | ABCDE |
 | 2 | 巴卡德 | abcd| abcd|
 | 3 | EEABG| 阿贝格| ab |

 答案是`2`。 痕迹显示，只有每个交叉点幸存下来的字母仍然存在。 

再举个例子：```
2
abc
def
```| 步骤| 当前的摇滚| 岩石中的字母| 剩余宝石 |
 | ---| ---| ---| ---|
 | 开始| 无 | 所有字母| abcdefghijklmnopqrstuvwxyz |
 | 1 | ABC | ABC | ABC |
 | 2 | 定义 | 定义 | 空 |

 答案是`0`。 这证明了每块岩石中都没有矿物出现的情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(所有字符串的总长度) | 构建集合时，每个字符都会处理一次 |
 | 空间| O(26) | 仅存储当前可能的宝石集 |

 该算法线性依赖于总输入大小，并且仅使用恒定的额外内存。 由于字母表的长度永远不会超过 26 个字母，因此即使岩石描述很大，该方法仍然有效。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline
    n_line = input().strip()
    if not n_line:
        return
    n = int(n_line)
    common = set("abcdefghijklmnopqrstuvwxyz")
    for _ in range(n):
        common &= set(input().strip())
    print(len(common))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

assert run("3\nabcdde\nbaccd\neeabg\n") == "2\n", "sample 1"
assert run("2\nabc\ndef\n") == "0\n", "no common minerals"
assert run("1\nxyz\n") == "3\n", "single rock"
assert run("3\naaa\na\naa\n") == "1\n", "duplicate occurrences"
assert run("4\nabcdefghijklmnopqrstuvwxyz\nabcdefghijklmnopqrstuvwxyz\nabc\nabc\n") == "3\n", "large alphabet boundary"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`3 / abcdde / baccd / eeabg`|`2`| 标准路口案例|
 |`2 / abc / def`|`0`| 没有共享矿物 |
 |`1 / xyz`|`3`| 单岩行为|
 |`3 / aaa / a / aa`|`1`| 重复字母计数一次 |
 | 四块岩石包含完整的字母表和减少的子集 |`3`| 正确处理较大的描述和边界|

 ## 边缘情况

 对于第一个边缘情况：```
3
aaa
a
aa
```第一块岩石只留下`a`作为候选人。 第二块岩石仍然含有`a`，第三块岩石还包含`a`，所以最终的集合只有一个元素。 算法输出`1`因为它跟踪存在而不是频率。 

对于第二种边缘情况：```
2
abc
def
```处理第一块岩石后，候选者是`{a, b, c}`。 与 相交`{d, e, f}`删除所有内容，留下一个空集。 算法正确输出`0`。 

对于单岩石情况：```
1
xyz
```所有字母的初始集合与`{x, y, z}`一次。 剩下的集合有三个元素，所以输出是`3`。 这是有效的，因为唯一岩石中的每种矿物质都存在于所有岩石中。 

对于字母大量重复的情况：```
3
aaaaab
bbbbba
ababab
```第一块岩石贡献`{a, b}`，第二个也有贡献`{a, b}`，第三个贡献`{a, b}`。 答案是`2`。 该算法会忽略重复出现的情况，因为它们不会影响岩石中是否存在矿物。
