import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from './comment.service';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  providers: [CommentService],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent implements OnInit {
  productId!: string;
  comments!: any[];
  newCommentText!: string;

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id ? id : '';
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getComments(this.productId).subscribe((comments) => {
      this.comments = comments;
    });
  }

  addComment(): void {
    if (this.newCommentText) {
      this.commentService
        .addComment(this.productId, this.newCommentText)
        .subscribe(() => {
          this.loadComments();
          this.newCommentText = '';
        });
    }
  }

  deleteComment(commentId: string): void {
    this.commentService.deleteComment(this.productId, commentId).subscribe(
      () => {
        this.loadComments();
      },
      (error) => {
        console.log(error.message);
        console.error('Error deleting comment:', error);
      }
    );
  }
}
