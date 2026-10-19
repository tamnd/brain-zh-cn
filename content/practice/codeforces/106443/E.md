---
title: "CF 106443E - 评估"
description: "该任务是代表棋盘的固定大小网格上的直接格式转换问题。 输入是一个 8 x 8 字符矩阵，其中每个单元格要么是一个棋子，要么是一个空方块。"
date: "2026-06-21T16:24:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106443
codeforces_index: "E"
codeforces_contest_name: "UFPE Starters Final Try-Outs 2026"
rating: 0
weight: 106443
solve_time_s: 62
verified: true
draft: false
---

[CF 106443E - 评估](https://codeforces.com/problemset/problem/106443/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该任务是代表棋盘的固定大小网格上的直接格式转换问题。 输入是一个 8 x 8 字符矩阵，其中每个单元格要么是一个棋子，要么是一个空方块。 棋子使用标准国际象棋符号进行编码，大写表示白色棋子，小写表示黑色棋子，而空方块则用点表示。 

所需的输出是采用 Forsyth-Edwards 表示法 (FEN) 的单个字符串。 FEN 从上到下压缩棋盘的每一行，用其计数替换连续的空方格，并保持棋子字符不变。 行由斜杠分隔。 

输入的结构已经与 FEN 板的空间布局相匹配，因此问题可以简化为仅应用于点的简单游程编码规则的行压缩。 

由于电路板尺寸固定为 8 x 8，因此限制很小。这意味着任何解决方案，即使是在整个网格上具有嵌套循环的解决方案，也会以恒定的时间运行。 不需要渐近优化。 唯一真正的要求是处理连续空方块和行分隔符的正确性。 

最常见的错误来自微妙的格式问题。 一个常见的错误是忘记刷新行末尾待处理的点计数。 例如，考虑行```
........
```正确的输出是`8`，但是仅在遇到非点字符时发出计数的简单实现会错误地生成空字符串，除非它显式处理行尾刷新。 

另一个边缘情况是混合数字和字符。 例如，```
r.bk...r
```必须成为`r1bk3r`。 有缺陷的方法可能会直接附加数字，而不考虑必须独立聚合多个点段。 

最后，行间距必须准确。 行之间缺少斜杠或在末尾添加尾部斜杠会产生无效的 FEN。 

## 方法

 强力解释将尝试处理每个单元并立即为每个字符发出输出。 人们可以按原样附加点，然后尝试对字符串进行后处理以压缩点串。 这将涉及再次扫描整个中间字符串以计算游程长度，这是不必要的且容易出错。 

该方法的低效率不是渐近意义上的时间复杂度，因为板的大小是恒定的，而是结构复杂性：多次传递和额外存储增加了跨行边界错误分组的机会。 

关键的观察结果是每行都是独立的，并且点压缩在行内纯粹是局部的。 这意味着我们可以在一次线性扫描中处理每一行，并维护连续点的计数器。 当遇到非点字符时，如果它非零，我们将刷新计数器，然后发出该字符。 在行的末尾，我们刷新所有剩余的计数器并附加行结果。 

这将问题减少到每行一次且具有恒定的附加状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解与后处理| 奥(64) | 奥(64) | 已接受但没有必要 |
 | 单遍行压缩 | 奥(64) | 奥(64) | 已接受 |

 ## 算法演练

 1. 完全按照长度为 8 的字符串读取棋盘的所有 8 行。每一行对应 FEN 输出顺序中的一个等级，因此不需要反转。 这保留了表示法所需的从上到下的排序。 
2. 初始化一个空列表来累积编码行。 即使输入大小很小，使用列表也可以避免重复的字符串连接成本。 
3. 对于每一行，初始化连续点的计数器和该行的编码版本的空字符串构建器。 
4. 从左到右扫描字符。 如果当前字符是点，则增加点计数器。 这会延迟输出，直到我们知道空段的完整长度为止。 
5. 如果当前字符不是点，首先检查点计数器是否非零。 如果是，则将其数值附加到行字符串并重置计数器。 然后附加片段字符本身。 
6. 完成一行扫描后，如果点计数器非零，则执行最后一次刷新。 这可确保尾随的空段不会丢失。 
7. 将编码行追加到行列表中。 
8. 使用斜杠连接所有编码行以形成最终的 FEN 字符串。 

### 为什么它有效

 每行被分解为点或块的最大连续段。 该算法将每个最大点段替换为其长度，并保持所有其他字符不变。 由于分段是严格从左到右进行的，没有重叠，因此每个方块对一个分段仅贡献一次。 行的独立性保证了跨行边界的段之间没有交互，因此每行的局部正确性意味着整个 FEN 字符串的全局正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def encode_row(row: str) -> str:
    res = []
    cnt = 0

    for ch in row:
        if ch == '.':
            cnt += 1
        else:
            if cnt:
                res.append(str(cnt))
                cnt = 0
            res.append(ch)

    if cnt:
        res.append(str(cnt))

    return ''.join(res)

def main():
    rows = [input().strip() for _ in range(8)]
    encoded = [encode_row(r) for r in rows]
    print('/'.join(encoded))

if __name__ == "__main__":
    main()
```该解决方案将行编码隔离到辅助函数中，这使得点压缩逻辑可重用并且更易于推理。 关键的实现细节是每次行扫描后点计数器的最终刷新； 没有它，尾随的空方块将永远不会被发射。 

使用列表`res`避免重复字符串连接带来的二次行为，即使此处的比例是固定的。 最后加入会产生最终的紧凑表示。 

## 工作示例

 ### 示例 1

 输入：```
rnbqkbnr
pppppppp
........
........
........
........
PPPPPPPP
RNBQKBNR
```处理每一行：

 | 行| 点跑 | 编码|
 | --- | --- | --- |
 | rnbqkbnr | 无 | rnbqkbnr |
 | 噗噗噗噗噗 无 | 噗噗噗噗噗
 | ........ | 8 | 8 |
 | ........ | 8 | 8 |
 | ........ | 8 | 8 |
 | ........ | 8 | 8 |
 | PPPPPPPPP| 无 | PPPPPPPPP|
 | RNBQKBNR | 无 | RNBQKBNR |

 最终输出：```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
```此跟踪显示完整空行的正确压​​缩，并确认保留了行边界。 

### 示例 2

 输入：```
r.bk...r
........
```| 行| 点跑 | 编码|
 | --- | --- | --- |
 | r.bk...r | 1, 3 | r1bk3r | r1bk3r |
 | ........ | 8 | 8 |

 最终输出：```
r1bk3r/8
```此示例验证多个单独的空段是否被独立处理以及尾随段是否已正确刷新。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 奥(64) | 长度为 8 的 8 行每行扫描一次 |
 | 空间| O(1) | O(1) | 仅输出缓冲区之外的恒定额外存储 |

 计算严格受固定的 8 x 8 网格限制，因此它会在给定限制内立即运行。 除了输出字符串本身之外，内存使用量是恒定的。 

## 测试用例```python
import sys, io

def solve():
    import sys
    input = sys.stdin.readline

    def encode_row(row: str) -> str:
        res = []
        cnt = 0
        for ch in row:
            if ch == '.':
                cnt += 1
            else:
                if cnt:
                    res.append(str(cnt))
                    cnt = 0
                res.append(ch)
        if cnt:
            res.append(str(cnt))
        return ''.join(res)

    rows = [input().strip() for _ in range(8)]
    print('/'.join(encode_row(r) for r in rows))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    solve()
    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# provided sample 1
assert run("""rnbqkbnr
pppppppp
........
........
........
........
PPPPPPPP
RNBQKBNR
""") == "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"

# provided sample 2
assert run("""r.bk...r
........
........
........
........
........
........
........
""") == "r1bk3r/8/8/8/8/8/8/8"

# single piece
assert run("""........
........
........
...K....
........
........
........
........
""") == "8/8/8/3K4/8/8/8/8"

# alternating pattern
assert run("""r.r.r.r.
........
........
........
........
........
........
........
""") == "r1r1r1r1/8/8/8/8/8/8/8"

# full pieces
assert run("""RNBQKBNR
RNBQKBNR
RNBQKBNR
RNBQKBNR
RNBQKBNR
RNBQKBNR
RNBQKBNR
RNBQKBNR
""") == "RNBQKBNR/RNBQKBNR/RNBQKBNR/RNBQKBNR/RNBQKBNR/RNBQKBNR/RNBQKBNR/RNBQKBNR"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 满空板行| 8/... | 全运行压缩|
 | 混合点和块| r1bk3r | r1bk3r | 多段|
 | 中心单件| 3K4 | 边界计数正确性 |
 | 交替模式| r1r1r1r1 | r1r1r1r1 | 重复刷新逻辑|
 | 整块板| 未更改的行 | 身份保存|

 ## 边缘情况

 完全空的行，例如`........`测试实现是否正确刷新行尾的点计数器。 该算法累积八个点，然后附加`8`当行结束时，确保不会丢失状态。 

具有多个分隔的空白区域的行，例如`r.bk...r`验证计数器在段之间是否正确重置。 扫描产生`r`，然后冲洗`1`， 然后`bk`，然后冲洗`3`，最后`r`，生产`r1bk3r`。 

完全由片段组成的行可确保点计数器始终保持为零，因此不会插入意外的数字。
